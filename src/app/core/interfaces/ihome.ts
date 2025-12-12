export interface IHome {
    logoImg: string;
    faceBookLink: string;
    instagramLink: string;
    tiktokLink: string;
    mainImgs: MainImg[];
  }
  
  export interface MainImg {
    id: number | null;
    title: string;
    description: string;
    imageCover: string; // مسار الصورة القديمة
    preview?: string | ArrayBuffer | null; // للعرض
    file?: File | null; // لو رفع صورة جديدة
  }