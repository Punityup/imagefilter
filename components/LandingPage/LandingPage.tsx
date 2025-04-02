import React, { useState, useRef } from 'react'
import styles from "./LandingPage.module.scss"

function LandingPage() {
    const [showPreview, setShowPreview] = useState(false)
    const [uploadedImage, setUploadedImage]: any = useState(null)
    const [originalImage, setOriginalImage] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef: any = useRef(null)

    const handleFileSelect = (event: any) => {
        const file = event.target.files[0]
        if (file) {
            processUploadedFile(file)
        }
    }

    const processUploadedFile = (file: any) => {

        if (file.size > 10 * 1024 * 1024) {
            alert("File size exceeds 10MB limit.")
            return
        }

        if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
            alert("Only PNG, JPEG, and WebP formats are allowed.")
            return
        }

        const imageUrl: any = URL.createObjectURL(file)
        setUploadedImage(imageUrl)
        setOriginalImage(imageUrl)
        setShowPreview(true)
    }

    // Handle browse button click
    const handleBrowseClick = () => {
        fileInputRef.current.click()
    }

    // Handle drag events
    const handleDragOver = (event: any) => {
        event.preventDefault()
        event.stopPropagation()
        setIsDragging(true)
    }

    const handleDragEnter = (event: any) => {
        event.preventDefault()
        event.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (event: any) => {
        event.preventDefault()
        event.stopPropagation()
        setIsDragging(false)
    }

    const handleDrop = (event: any) => {
        event.preventDefault()
        event.stopPropagation()
        setIsDragging(false)

        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            const file = event.dataTransfer.files[0]
            processUploadedFile(file)
        }
    }

    const handleBackClick = () => {
        setShowPreview(false)
        setUploadedImage(null)
    }

    const toggleOriginal = () => {
        if (uploadedImage === originalImage) {
            setUploadedImage('/previewimg.webp')
        } else {
            setUploadedImage(originalImage)
        }
    }
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
                                    <p>Drop an image or paste a URL let&apos; make some magic happen! ✨ Just keep it cool and within limits.</p>
                                </div>
                            </div>

                            <div className={styles.landingImg}>
                                <img src='landingimg.png' alt='landingimg' />
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
                                <img src={uploadedImage} alt='preview' />
                                <button onClick={toggleOriginal}>{uploadedImage === originalImage ? 'See Original' : "See Generated"}</button>
                            </div>

                            <div className={styles.themesAndGenerate}>
                                <h4>Themes</h4>
                                <div className={styles.themesGrid}>
                                    <div className={styles.theme}>
                                        <div className={styles.themeImg}>
                                            <img src='/sepia.png' alt='sepia' />
                                        </div>
                                        <p>Sepia</p>
                                    </div>

                                    <div className={styles.theme}>
                                        <div className={styles.themeImg}>
                                            <img src='/blur.png' alt='blur' />
                                        </div>
                                        <p>Blur</p>
                                    </div>

                                    <div className={styles.theme}>
                                        <div className={styles.themeImg}>
                                            <img src='/theme3.png' alt='theme1' />
                                        </div>
                                        <p>Grey</p>
                                    </div>
                                </div>

                                <div className={styles.generateImg}>
                                    <button className={styles.generateBtn}>Generate Image</button>
                                    <button className={styles.downloadBtn}>Download Image</button>
                                    <p onClick={handleBackClick} style={{ cursor: 'pointer' }}>
                                        Back to home
                                    </p>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default LandingPage