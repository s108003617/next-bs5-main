import React, { useState, useEffect } from 'react'

export default function PreviewUploadImage({
  avatarImg = '',
  avatarBaseUrl = '',
  defaultImg = 'default.png',
  setSelectedFile,
  selectedFile,
}) {
  // 預覽圖片
  const [preview, setPreview] = useState('')

  // 當選擇檔案更動時建立預覽圖
  useEffect(() => {
    if (!selectedFile) {
      setPreview('')
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    // 當元件unmounted時清除記憶體
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  const handleFileChang = (e) => {
    const file = e.target.files[0]

    if (file) {
      setSelectedFile(file)
    } else {
      setSelectedFile(null)
    }
  }

  const showImg = () => {
    if (selectedFile) {
      return preview
    }

    if (avatarImg) {
      return avatarBaseUrl + '/' + avatarImg
    }

    return avatarBaseUrl + '/' + defaultImg
  }

  return (
    <div className="image-upload">
      <label htmlFor="file-input" className="circular-image-container">
        <img src={showImg()} alt="" className="circular-image" />
        <div className="image-overlay">
          <span>更換照片</span>
        </div>
      </label>
      <input
        id="file-input"
        type="file"
        name="file"
        onChange={handleFileChang}
      />
      <div>
        <p>點按頭像可以選擇新照片</p>
      </div>
      <style jsx>{`
        .image-upload > input {
          display: none;
        }
        .circular-image-container {
          position: relative;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .circular-image-container:hover {
          box-shadow: 0 0 20px rgba(0,0,0,0.2);
        }
        .circular-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.3s ease;
        }
        .circular-image-container:hover .circular-image {
          filter: brightness(70%);
        }
        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(0,0,0,0.5);
          color: white;
          font-size: 16px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .circular-image-container:hover .image-overlay {
          opacity: 1;
        }
      `}</style>
    </div>
  )
}