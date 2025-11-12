import React, { useState, useMemo, useEffect } from 'react';
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    setDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import { Motorcycle, ServiceLog, Reminder, TechData, View } from './types';
import { db, storage } from './firebase';
import { useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import GarageView from './components/GarageView';
import ServiceLogView from './components/ServiceLogView';
import RemindersView from './components/RemindersView';
import TechDataView from './components/TechDataView';
import BottomNavBar from './components/BottomNavBar';
import MobileHeader from './components/MobileHeader';
import AuthView from './components/AuthView';
import { MotorcycleIcon } from './components/icons';

const App: React.FC = () => {
    const { currentUser, loadingAuth } = useAuth();
    const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
    const [serviceLogs, setServiceLogs] = useState<ServiceLog[]>([]);
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [techData, setTechData] = useState<TechData[]>([]);

    const [activeView, setActiveView] = useState<View>('garage');
    const [selectedMotorcycleId, setSelectedMotorcycleId] = useState<string | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(true);

    // --- Data Fetching ---
    const fetchMotorcycles = async () => {
        if (!currentUser) return;
        setIsLoadingData(true);
        try {
            const motosCollection = collection(db, 'users', currentUser.uid, 'motorcycles');
            const motoSnapshot = await getDocs(motosCollection);
            const motoList = motoSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Motorcycle[];
            setMotorcycles(motoList);
            return motoList;
        } catch (error) {
            console.error("Error fetching motorcycles:", error);
            return [];
        } finally {
            setIsLoadingData(false);
        }
    };
    
    useEffect(() => {
        if (currentUser) {
            fetchMotorcycles().then(motoList => {
                setSelectedMotorcycleId(prevId => {
                    if (prevId && motoList.some(m => m.id === prevId)) return prevId;
                    return motoList.length > 0 ? motoList[0].id : null;
                });
            });
        } else {
            // Clear all data on logout
            setMotorcycles([]);
            setServiceLogs([]);
            setReminders([]);
            setTechData([]);
            setSelectedMotorcycleId(null);
            setIsLoadingData(false);
        }
    }, [currentUser]);

    useEffect(() => {
        if (!selectedMotorcycleId || !currentUser) {
            setServiceLogs([]);
            setReminders([]);
            setTechData([]);
            return;
        }

        const fetchDependentData = async () => {
            const logsQuery = query(collection(db, 'users', currentUser.uid, 'serviceLogs'), where("motorcycleId", "==", selectedMotorcycleId));
            const logsSnapshot = await getDocs(logsQuery);
            const fetchedLogs = logsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as ServiceLog[];
            fetchedLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setServiceLogs(fetchedLogs);

            const remindersQuery = query(collection(db, 'users', currentUser.uid, 'reminders'), where("motorcycleId", "==", selectedMotorcycleId));
            const remindersSnapshot = await getDocs(remindersQuery);
            setReminders(remindersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Reminder[]);

            const techQuery = query(collection(db, 'users', currentUser.uid, 'techData'), where("motorcycleId", "==", selectedMotorcycleId));
            const techSnapshot = await getDocs(techQuery);
            setTechData(techSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as TechData[]);
        };

        fetchDependentData();
    }, [selectedMotorcycleId, currentUser]);


    // --- State Management Functions ---
     const addMotorcycle = async (motoData: Omit<Motorcycle, 'id' | 'photo'>, photoFile: File | null) => {
        if (!currentUser) {
            throw new Error("Debes iniciar sesión para agregar una moto.");
        }

        const newMotoRef = doc(collection(db, 'users', currentUser.uid, 'motorcycles'));
        let finalPhotoUrl = '';

        if (photoFile) {
            const options = {
                maxSizeMB: 1, // Max size in MB
                maxWidthOrHeight: 1920, // Max width or height
                useWebWorker: true,
            };

            try {
                const compressedFile = await imageCompression(photoFile, options);
                const storageRef = ref(storage, `users/${currentUser.uid}/motorcycles/${newMotoRef.id}/${compressedFile.name}`);
                await uploadBytes(storageRef, compressedFile);
                finalPhotoUrl = await getDownloadURL(storageRef);
            } catch (error) {
                console.error("Error compressing or uploading image:", error);
                throw new Error("No se pudo procesar la imagen. Inténtalo de nuevo.");
            }
        }

        const finalMotoData = {
            ...motoData,
            photo: finalPhotoUrl,
        };

        await setDoc(newMotoRef, finalMotoData);

        const updatedMotos = await fetchMotorcycles();

        if (updatedMotos.some(m => m.id === newMotoRef.id)) {
            setSelectedMotorcycleId(newMotoRef.id);
        } else {
             setSelectedMotorcycleId(updatedMotos.length > 0 ? updatedMotos[0].id : null);
        }
    };

    const addServiceLog = async (log: Omit<ServiceLog, 'id'>) => {
        if (!currentUser) return;
        const docRef = await addDoc(collection(db, 'users', currentUser.uid, 'serviceLogs'), log);
        const newLog = { ...log, id: docRef.id };
        setServiceLogs(prev => [...prev, newLog].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    };
    
    const addReminder = async (reminder: Omit<Reminder, 'id'>) => {
        if (!currentUser) return;
        const docRef = await addDoc(collection(db, 'users', currentUser.uid, 'reminders'), reminder);
        setReminders(prev => [...prev, { ...reminder, id: docRef.id }]);
    };
    const deleteReminder = async (id: string) => {
        if (!currentUser) return;
        await deleteDoc(doc(db, 'users', currentUser.uid, 'reminders', id));
        setReminders(prev => prev.filter(r => r.id !== id));
    };

    const addTechData = async (data: Omit<TechData, 'id'>) => {
        if (!currentUser) return;
        const docRef = await addDoc(collection(db, 'users', currentUser.uid, 'techData'), data);
        setTechData(prev => [...prev, { ...data, id: docRef.id }]);
    };
    const deleteTechData = async (id: string) => {
        if (!currentUser) return;
        await deleteDoc(doc(db, 'users', currentUser.uid, 'techData', id));
        setTechData(prev => prev.filter(d => d.id !== id));
    };

    // --- Memoized Data ---
    const selectedMotorcycle = useMemo(() => {
        return motorcycles.find(m => m.id === selectedMotorcycleId);
    }, [motorcycles, selectedMotorcycleId]);

    // --- View Rendering Logic ---
    const renderActiveView = () => {
        if (isLoadingData && motorcycles.length === 0 && currentUser) {
            return (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <MotorcycleIcon className="w-16 h-16 text-gray-600 animate-pulse mb-4" />
                    <h3 className="text-xl font-semibold text-gray-400">Cargando tu garage...</h3>
                </div>
            );
        }
        switch (activeView) {
            case 'garage':
                return <GarageView motorcycles={motorcycles} addMotorcycle={addMotorcycle} />;
            case 'services':
                return <ServiceLogView selectedMotorcycle={selectedMotorcycle} serviceLogs={serviceLogs} addServiceLog={addServiceLog} />;
            case 'reminders':
                return <RemindersView selectedMotorcycle={selectedMotorcycle} reminders={reminders} addReminder={addReminder} deleteReminder={deleteReminder} />;
            case 'tech':
                return <TechDataView selectedMotorcycle={selectedMotorcycle} techData={techData} addTechData={addTechData} deleteTechData={deleteTechData} />;
            default:
                return <GarageView motorcycles={motorcycles} addMotorcycle={addMotorcycle} />;
        }
    };
    
    if (loadingAuth) {
        return (
            <div className="flex min-h-screen bg-[#0a0a0a] items-center justify-center">
                <MotorcycleIcon className="w-24 h-24 text-[#00f6ff] animate-pulse" />
            </div>
        );
    }

    if (!currentUser) {
        return <AuthView />;
    }

    return (
        <div className="flex min-h-screen bg-[#0a0a0a]">
            <Sidebar
                activeView={activeView}
                setActiveView={setActiveView}
                motorcycles={motorcycles}
                selectedMotorcycleId={selectedMotorcycleId}
                setSelectedMotorcycleId={setSelectedMotorcycleId}
            />
            <main className="flex-1 pb-24 md:pb-0">
                <MobileHeader
                    activeView={activeView}
                    motorcycles={motorcycles}
                    selectedMotorcycle={selectedMotorcycle}
                    setSelectedMotorcycleId={setSelectedMotorcycleId}
                />
                {renderActiveView()}
            </main>
            <BottomNavBar
                activeView={activeView}
                setActiveView={setActiveView}
                hasMotorcycles={motorcycles.length > 0}
            />
        </div>
    );
};

export default App;