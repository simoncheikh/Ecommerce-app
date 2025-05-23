import { create } from 'zustand';

interface CameraState {
    isCameraOpen: boolean;
    openCamera: () => void;
    closeCamera: () => void;
    toggleCamera: () => void;
    setCameraOpen: (open: boolean) => void; 
}

export const useCameraStore = create<CameraState>((set) => ({
    isCameraOpen: false,
    openCamera: () => set({ isCameraOpen: true }),
    closeCamera: () => set({ isCameraOpen: false }),
    toggleCamera: () => set((state) => ({ isCameraOpen: !state.isCameraOpen })),
    setCameraOpen: (open: boolean) => set({ isCameraOpen: open }), 
}));
