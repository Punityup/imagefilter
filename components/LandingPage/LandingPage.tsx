import React, { useState, useRef, useEffect } from 'react';
import styles from "./LandingPage.module.scss";
import toast, { Toaster } from 'react-hot-toast';

function LandingPage() {
    const [showPreview, setShowPreview] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isGenerated, setIsGenerated] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const CLOUDINARY_UPLOAD_PRESET = "punityup";
    const CLOUDINARY_CLOUD_NAME = "diurqgpbm";
    const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;




    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            processUploadedFile(file);
        }
    };

    const processUploadedFile = (file: File) => {
        if (file.size > 10 * 1024 * 1024) {
            toast.error("File size exceeds 10MB limit.");
            return;
        }

        if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
            toast.error('Only PNG, JPEG, and WebP formats are allowed.');
            return;
        }

        const imageUrl = URL.createObjectURL(file);
        setUploadedImage(imageUrl);
        setOriginalImage(imageUrl);
        setShowPreview(true);
        setUploadedFile(file);
        setIsGenerated(false);
        setGeneratedImage(null);
        setSelectedTheme(null);
    };

    const handleBrowseClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
    };

    const handleDragEnter = (event: React.DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (event: React.DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);

        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            const file = event.dataTransfer.files[0];
            processUploadedFile(file);
        }
    };

    const handleBackClick = () => {
        setShowPreview(false);
        setUploadedImage(null);
        setOriginalImage(null);
        setGeneratedImage(null);
        setSelectedTheme(null);
        setIsGenerated(false);
    };

    const toggleOriginal = () => {
        if (isGenerated) {
            if (uploadedImage === originalImage) {
                setUploadedImage(generatedImage);
            } else {
                setUploadedImage(originalImage);
            }
        }
    };

    const handleThemeSelect = (theme: string) => {
        if (selectedTheme === theme) {
            setSelectedTheme(null);
        } else {
            setSelectedTheme(theme);
        }
    };

    const applyCloudinaryTransformation = async () => {
        if (!uploadedFile || !selectedTheme) return;

        setIsGenerating(true);

        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        let transformation = '';
        switch (selectedTheme) {
            case 'sepia':
                transformation = 'e_sepia:80';
                break;
            case 'blur':
                transformation = 'e_blur:500';
                break;
            case 'grey':
                transformation = 'e_grayscale';
                break;
            default:
                transformation = '';
        }

        try {
            const uploadResponse = await fetch(CLOUDINARY_UPLOAD_URL, {
                method: 'POST',
                body: formData
            });

            const uploadData = await uploadResponse.json();

            if (uploadData.secure_url) {
                const baseUrl = uploadData.secure_url.split('/upload/')[0] + '/upload/';
                const fileName = uploadData.secure_url.split('/upload/')[1];

                const transformedImageUrl = `${baseUrl}${transformation}/${fileName}`;

                setGeneratedImage(transformedImageUrl);
                setUploadedImage(transformedImageUrl);
                setIsGenerated(true);

                toast.success('Image generated successfully!');


            } else {
                toast.error('Error uploading image');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error applying filter. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };


    const handleGenerateClick = () => {
        if (selectedTheme) {
            applyCloudinaryTransformation();
        }
    };

    const handleDownloadClick = async () => {
        if (!generatedImage) return;

        try {
            const response = await fetch(generatedImage);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `image_${selectedTheme}.${uploadedFile?.name.split('.').pop() || 'jpg'}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Error downloading image');
        }
    };


    useEffect(() => {
        if (isGenerated && generatedImage) {
            setUploadedImage(generatedImage);
        }
    }, [generatedImage, isGenerated]);

    return (
        <div className={styles.landingMain}>
            <div className={styles.landingContainer}>
                <div className={styles.landingSub}>
                    <div className={styles.landingHeader}>
                        <h1>Upload, Filter, Download – Effortless Image Editing in the Cloud</h1>
                        <p>Upload images, apply filters, and download instantly with cloud-based processing.</p>
                    </div>
                    {!showPreview &&
                        <div className={styles.UploadAndLandingImgDiv}>
                            <div className={styles.uploadMain}>
                                <div className={styles.uploadDiv}>
                                    <div
                                        className={`${styles.uploadAndDropBox} ${isDragging ? styles.dragging : ''}`}
                                        onDragOver={handleDragOver}
                                        onDragEnter={handleDragEnter}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                    >
                                        <div className={styles.uploadIcon}>
                                            <img src='/upload.svg' alt='upload' />
                                        </div>
                                        <h4>Drop file or Browse</h4>
                                        <p>Format: png, jpeg, webp & Max file size: 10 MB</p>
                                    </div>
                                    <div className={styles.browseDiv}>
                                        <input
                                            type="file"
                                            accept=".png,.jpg,.jpeg,.webp"
                                            style={{ display: 'none' }}
                                            ref={fileInputRef}
                                            onChange={handleFileSelect}
                                        />
                                        <button onClick={handleBrowseClick}>
                                            <div className={styles.browseIcon}>
                                                <img src='browse.svg' alt='browse' />
                                            </div>
                                            <p>Browse</p>
                                        </button>
                                        <p>Or Drop files in the drop zone above.</p>
                                    </div>
                                </div>

                                <div className={styles.uploadInfo}>
                                    <p>Drop an image or paste a URL let&apos;s make some magic happen! ✨ Just keep it cool and within limits.</p>
                                </div>
                            </div>

                            <div className={styles.landingImg}>
                                <img src='/landing.png' alt='landingimg' />
                            </div>
                        </div>}

                    {showPreview &&
                        <div className={styles.previewAndGenerate}>
                            <div className={styles.backBtn}>
                                <button onClick={handleBackClick}>
                                    <div className={styles.backArrow}>
                                        <img src='backarrow.svg' alt='backarrow' />
                                    </div>
                                    <p>Back</p>
                                </button>
                            </div>

                            <div className={styles.previewImgDiv}>
                                {uploadedImage && <img src={uploadedImage} alt='preview' />}

                                {isGenerated && (
                                    <button onClick={toggleOriginal}>
                                        {uploadedImage === originalImage ? 'See Generated' : 'See Original'}
                                    </button>
                                )}
                            </div>

                            <div className={styles.themesAndGenerate}>
                                <h4>Themes</h4>
                                <div className={styles.themesGrid}>
                                    <div
                                        className={`${styles.theme} ${selectedTheme === 'sepia' ? styles.selectedTheme : ''}`}
                                        onClick={() => handleThemeSelect('sepia')}
                                    >
                                        <div className={styles.themeImg}>
                                            <img src='/sepia.png' alt='sepia' />
                                        </div>
                                        <p>Sepia</p>
                                    </div>

                                    <div
                                        className={`${styles.theme} ${selectedTheme === 'blur' ? styles.selectedTheme : ''}`}
                                        onClick={() => handleThemeSelect('blur')}
                                    >
                                        <div className={styles.themeImg}>
                                            <img src='/blur.png' alt='blur' />
                                        </div>
                                        <p>Blur</p>
                                    </div>

                                    <div
                                        className={`${styles.theme} ${selectedTheme === 'grey' ? styles.selectedTheme : ''}`}
                                        onClick={() => handleThemeSelect('grey')}
                                    >
                                        <div className={styles.themeImg}>
                                            <img src='/theme3.png' alt='theme1' />
                                        </div>
                                        <p>Grey</p>
                                    </div>
                                </div>

                                <div className={styles.generateImg}>
                                    {selectedTheme && !isGenerated && (
                                        <button
                                            className={styles.generateBtn}
                                            onClick={handleGenerateClick}
                                            disabled={isGenerating}
                                        >
                                            {isGenerating ? 'Generating...' : 'Generate Image'}
                                        </button>
                                    )}

                                    {isGenerated && (
                                        <button
                                            className={styles.downloadBtn}
                                            onClick={handleDownloadClick}
                                        >
                                            Download Image
                                        </button>
                                    )}

                                    <p onClick={handleBackClick} style={{ cursor: 'pointer' }}>
                                        Back to home
                                    </p>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>


            <Toaster
                position="top-right"
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                    duration: 5000,
                    removeDelay: 1000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: 'green',
                            secondary: 'black',
                        },
                    },
                }}
            />
        </div>




    );
}

export default LandingPage;