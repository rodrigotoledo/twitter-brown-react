import { useEffect, useRef, useState } from 'react'

interface Props {
  postUrl: string
  postContent: string
  isOpen: boolean
  onClose: () => void
}

const ShareMenu = ({ postUrl, postContent, isOpen, onClose }: Props) => {
  const menuRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(postUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = postUrl
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleWhatsApp = () => {
    const text = `${postContent}\n\n${postUrl}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(whatsappUrl, '_blank')
    onClose()
  }

  const handleLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`
    window.open(linkedinUrl, '_blank')
    onClose()
  }

  const handleInstagram = () => {
    const text = `${postContent}\n\n${postUrl}`
    navigator.clipboard.writeText(text).catch(() => {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    })
    window.open('https://www.instagram.com/', '_blank')
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div
        ref={menuRef}
        className="fixed bg-cursor-light dark:bg-cursor-dark border border-cursor-border rounded-lg shadow-lg z-50 p-4 flex flex-col gap-4"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <h3 className="text-sm font-semibold text-cursor-foreground">Share post</h3>
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleWhatsApp}
            className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition"
            title="Share on WhatsApp"
            type="button"
          >
            <svg
              className="w-6 h-6 text-green-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-9.746 9.798c0 2.734.732 5.408 2.121 7.734L2.88 23.5l8.239-2.592a9.833 9.833 0 004.741 1.209h.004c5.44 0 9.902-4.467 9.903-9.922 0-2.646-.576-5.145-1.682-7.59-1.106-2.445-2.685-4.627-4.613-6.295-1.928-1.668-4.213-2.885-6.75-3.486-2.536-.601-5.253-.37-7.758.68m11.772 15.779c-.59-.298-3.491-1.723-4.032-1.92-.54-.198-.934-.248-1.327.248-.393.497-1.522 1.92-1.865 2.315-.343.396-.686.445-1.275.148-.59-.297-2.49-.92-4.742-2.926-1.754-1.56-2.936-3.485-3.28-4.08-.343-.594-.036-.914.258-1.21.265-.264.59-.688.884-1.03.295-.343.393-.594.59-.987.198-.393.099-.727-.05-1.02-.148-.297-.927-2.234-1.27-3.058-.335-.787-.68-.676-.927-.689-.242-.013-.52-.01-.799-.01-.279 0-.726.098-1.106.474-.38.377-1.435 1.403-1.435 3.417 0 2.014 1.467 3.966 1.671 4.245.203.279 2.871 4.383 6.961 6.15 2.004.924 3.566 1.478 4.783 1.888.999.322 1.91.276 2.629.166.802-.12 2.474-.804 2.822-1.581.348-.777.348-1.441.243-1.581-.104-.14-.389-.223-.814-.393" />
            </svg>
          </button>

          <button
            onClick={handleLinkedIn}
            className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
            title="Share on LinkedIn"
            type="button"
          >
            <svg
              className="w-6 h-6 text-blue-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.731-2.004 1.438-.103.249-.129.597-.129.946v5.421h-3.554s.05-8.807 0-9.726h3.554v1.375c.425-.654 1.187-1.585 2.882-1.585 2.105 0 3.683 1.375 3.683 4.338v5.598zM5.337 8.855c-1.144 0-1.915-.758-1.915-1.706 0-.968.771-1.71 1.906-1.71.953 0 1.914.742 1.939 1.71 0 .948-.986 1.706-1.93 1.706zm1.581 11.597H3.635V9.726h3.283v10.726zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
            </svg>
          </button>

          <button
            onClick={handleInstagram}
            className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-900/30 transition"
            title="Share on Instagram"
            type="button"
          >
            <svg
              className="w-6 h-6 text-pink-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057-1.645.069-4.849.069-3.204 0-3.584-.012-4.849-.069-3.259-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.716 0 8.298.012 7.02.072 2.735.272.273 2.69.073 7.052.012 8.25 0 8.674 0 12s.015 3.75.072 4.948c.2 4.358 2.618 6.78 6.98 6.98 1.271.058 1.69.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.617 6.979-6.98.059-1.197.072-1.621.072-4.948 0-3.329-.013-3.748-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.75.013 15.331 0 12 0z" />
              <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8z" />
              <circle cx="18.406" cy="5.594" r="1.44" />
            </svg>
          </button>

          <button
            onClick={handleCopyUrl}
            className={`flex items-center justify-center w-12 h-12 rounded-lg transition ${
              copied
                ? 'bg-green-100 dark:bg-green-900/30'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700/30'
            }`}
            title="Copy URL"
            type="button"
          >
            {copied ? (
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-cursor-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </>
  )
}

export default ShareMenu
