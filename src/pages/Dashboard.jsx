import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"

import {
  Search,
  FileText,
  Download,
  User,
  BadgeCheck,
  Eye,
  Sparkles,
} from "lucide-react"

export default function Dashboard() {

  // =========================================
  // STATES
  // =========================================
  const [applicationId, setApplicationId] = useState("")
  const [applicant, setApplicant] = useState(null)
  const [pdfUrl, setPdfUrl] = useState("")
  const [loading, setLoading] = useState(false)

  // =========================================
  // BACKEND URL
  // =========================================
  const API = "http://192.168.0.9:8000"

  // =========================================
  // FETCH APPLICANT DETAILS ONLY
  // =========================================
  const fetchApplicant = async () => {

    if (!applicationId) {

      alert("Please enter Application ID")
      return
    }

    try {

      setLoading(true)

      // CLEAR OLD DATA
      setApplicant(null)
      setPdfUrl("")

      // FETCH APPLICANT
      const response = await fetch(
        `${API}/applicant/${applicationId}`
      )

      const data = await response.json()

      console.log("Applicant:", data)

      if (!data.success) {

        alert(data.message)
        return
      }

      // ONLY DETAILS
      setApplicant(data.data)

    } catch (error) {

      console.log(error)

      alert("Backend Connection Failed")

    } finally {

      setLoading(false)
    }
  }

  // =========================================
  // GENERATE CERTIFICATE
  // =========================================
  const generateCertificate = async () => {

    if (!applicationId) {

      alert("Please enter Application ID")
      return
    }

    try {

      setLoading(true)

      // CLEAR OLD DATA
      setApplicant(null)
      setPdfUrl("")

      // =====================================
      // FETCH LATEST APPLICANT
      // =====================================
      const applicantResponse = await fetch(
        `${API}/applicant/${applicationId}`
      )

      const applicantData =
        await applicantResponse.json()

      if (!applicantData.success) {

        alert(applicantData.message)
        return
      }

      // UPDATE DETAILS
      setApplicant(applicantData.data)

      // =====================================
      // GENERATE PDF
      // =====================================
      const response = await fetch(
        `${API}/generate/${applicationId}`,
        {
          method: "POST"
        }
      )

      const data = await response.json()

      console.log("PDF:", data)

      if (!data.success) {

        alert(data.message)
        return
      }

      // =====================================
      // UPDATE PREVIEW
      // =====================================
      if (data.pdf_url) {

        const fullUrl =
          `${API}${data.pdf_url}?t=${Date.now()}`

        console.log("FULL PDF URL:", fullUrl)

        setPdfUrl(fullUrl)
      }

      alert(data.message)

    } catch (error) {

      console.log(error)

      alert("PDF Generation Failed")

    } finally {

      setLoading(false)
    }
  }

  // =========================================
  // DOWNLOAD PDF
  // =========================================
  const downloadPDF = async () => {

    try {

      const response = await fetch(pdfUrl)

      const blob = await response.blob()

      const url = window.URL.createObjectURL(blob)

      const a = document.createElement("a")

      a.href = url
      a.download = "certificate.pdf"

      document.body.appendChild(a)

      a.click()

      a.remove()

    } catch (error) {

      console.log(error)

      alert("Download Failed")
    }
  }

  return (
    <>
      <style>{`

        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
          font-family:Inter,sans-serif;
        }

        body{
          background:#0f172a;
        }

        .dashboard{
          min-height:100vh;
          background:
          radial-gradient(circle at top left,#2563eb55,transparent 30%),
          radial-gradient(circle at bottom right,#7c3aed55,transparent 30%),
          #0f172a;
          padding:40px 20px;
        }

        .main-card{
          max-width:1400px;
          margin:auto;
          background:rgba(255,255,255,0.08);
          border:1px solid rgba(255,255,255,0.1);
          backdrop-filter:blur(16px);
          border-radius:30px;
          overflow:hidden;
          box-shadow:0 20px 60px rgba(0,0,0,0.4);
        }

        .header{
          padding:40px;
          border-bottom:1px solid rgba(255,255,255,0.08);
          display:flex;
          justify-content:space-between;
          align-items:center;
          flex-wrap:wrap;
          gap:20px;
        }

        .title-section h1{
          font-size:42px;
          color:white;
          font-weight:800;
        }

        .title-section p{
          margin-top:10px;
          color:#cbd5e1;
          font-size:17px;
        }

        .badge{
          background:linear-gradient(to right,#2563eb,#7c3aed);
          color:white;
          padding:12px 20px;
          border-radius:999px;
          display:flex;
          align-items:center;
          gap:10px;
          font-weight:600;
          font-size:14px;
        }

        .content{
          display:grid;
          grid-template-columns:400px 1fr;
          gap:30px;
          padding:30px;
        }

        .left-panel{
          background:rgba(255,255,255,0.06);
          border-radius:24px;
          padding:24px;
          border:1px solid rgba(255,255,255,0.08);
          height:fit-content;
        }

        .panel-title{
          color:white;
          font-size:24px;
          font-weight:700;
          margin-bottom:25px;
        }

        .input-box{
          margin-bottom:20px;
        }

        .input-box label{
          display:block;
          margin-bottom:10px;
          color:#cbd5e1;
          font-weight:600;
        }

        .input-wrapper{
          position:relative;
        }

        .input-wrapper svg{
          position:absolute;
          left:16px;
          top:50%;
          transform:translateY(-50%);
          color:#94a3b8;
        }

        input{
          width:100%;
          padding:16px 16px 16px 48px;
          border-radius:16px;
          border:none;
          outline:none;
          background:#1e293b;
          color:white;
          font-size:16px;
          border:2px solid transparent;
        }

        input:focus{
          border:2px solid #3b82f6;
        }

        .btn{
          width:100%;
          border:none;
          padding:16px;
          border-radius:16px;
          cursor:pointer;
          font-size:16px;
          font-weight:700;
          transition:0.3s;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:10px;
        }

        .fetch-btn{
          background:linear-gradient(to right,#2563eb,#3b82f6);
          color:white;
          margin-bottom:18px;
        }

        .generate-btn{
          background:linear-gradient(to right,#16a34a,#22c55e);
          color:white;
        }

        .download-btn{
          background:linear-gradient(to right,#7c3aed,#8b5cf6);
          color:white;
          margin-top:16px;
        }

        .details-card{
          margin-top:25px;
          background:#111827;
          border-radius:22px;
          padding:22px;
          border:1px solid rgba(255,255,255,0.06);
        }

        .details-header{
          display:flex;
          align-items:center;
          gap:10px;
          margin-bottom:20px;
          color:white;
          font-size:20px;
          font-weight:700;
        }

        .detail-row{
          display:flex;
          justify-content:space-between;
          padding:14px 0;
          border-bottom:1px solid rgba(255,255,255,0.06);
          gap:15px;
        }

        .detail-row:last-child{
          border-bottom:none;
        }

        .detail-key{
          color:#94a3b8;
          font-weight:600;
        }

        .detail-value{
          color:white;
          text-align:right;
          max-width:60%;
          word-break:break-word;
        }

        .right-panel{
          background:rgba(255,255,255,0.06);
          border-radius:24px;
          padding:24px;
          border:1px solid rgba(255,255,255,0.08);
        }

        .preview-header{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:20px;
          flex-wrap:wrap;
          gap:10px;
        }

        .preview-title{
          color:white;
          font-size:26px;
          font-weight:700;
          display:flex;
          align-items:center;
          gap:10px;
        }

        .status{
          background:#1d4ed8;
          color:white;
          padding:8px 14px;
          border-radius:999px;
          font-size:13px;
          font-weight:700;
        }

        .preview-box{
          height:780px;
          border-radius:22px;
          overflow:hidden;
          background:white;
          border:2px dashed rgba(255,255,255,0.15);
          display:flex;
          align-items:center;
          justify-content:center;
        }

        iframe{
          width:100%;
          height:100%;
          border:none;
        }

        .empty-preview{
          text-align:center;
          color:#94a3b8;
        }

        .empty-preview svg{
          width:90px;
          height:90px;
          margin-bottom:18px;
          opacity:0.6;
        }

        .empty-preview h2{
          color:white;
          margin-bottom:10px;
        }

        .qr-section{
          margin-top:24px;
          background:#111827;
          border-radius:24px;
          padding:24px;
          border:1px solid rgba(255,255,255,0.06);
        }

        .qr-title{
          color:white;
          font-size:22px;
          font-weight:700;
          margin-bottom:20px;
          text-align:center;
        }

        .qr-wrapper{
          display:flex;
          justify-content:center;
          align-items:center;
          padding:20px;
          background:white;
          border-radius:20px;
          width:fit-content;
          margin:auto;
        }

        .qr-text{
          margin-top:18px;
          text-align:center;
          color:#94a3b8;
          font-size:14px;
        }

        /* =========================================
           LARGE TABLETS
        ========================================= */
        @media(max-width:1200px){

          .content{
            grid-template-columns:1fr;
          }

          .left-panel,
          .right-panel{
            width:100%;
          }

          .preview-box{
            height:650px;
          }
        }

        /* =========================================
           TABLETS
        ========================================= */
        @media(max-width:768px){

          .dashboard{
            padding:20px 12px;
          }

          .header{
            padding:25px 20px;
            flex-direction:column;
            align-items:flex-start;
          }

          .title-section h1{
            font-size:30px;
            line-height:1.2;
          }

          .title-section p{
            font-size:15px;
          }

          .content{
            padding:18px;
            gap:20px;
          }

          .left-panel,
          .right-panel{
            padding:18px;
            border-radius:20px;
          }

          .panel-title{
            font-size:22px;
          }

          .preview-title{
            font-size:22px;
          }

          .preview-box{
            height:500px;
          }

          .btn{
            padding:14px;
            font-size:15px;
          }

          input{
            font-size:15px;
            padding:14px 14px 14px 45px;
          }

          .details-card{
            padding:18px;
          }

          .detail-row{
            flex-direction:column;
            align-items:flex-start;
            gap:8px;
          }

          .detail-value{
            text-align:left;
            max-width:100%;
          }

          .qr-wrapper{
            width:100%;
          }
        }

        /* =========================================
           MOBILE DEVICES
        ========================================= */
        @media(max-width:480px){

          .dashboard{
            padding:12px 8px;
          }

          .main-card{
            border-radius:20px;
          }

          .header{
            padding:20px 15px;
          }

          .title-section h1{
            font-size:24px;
          }

          .title-section p{
            font-size:14px;
          }

          .badge{
            width:100%;
            justify-content:center;
            font-size:13px;
            padding:10px;
          }

          .content{
            padding:12px;
            gap:15px;
          }

          .left-panel,
          .right-panel{
            padding:14px;
            border-radius:18px;
          }

          .panel-title{
            font-size:20px;
          }

          .preview-title{
            font-size:18px;
          }

          .preview-header{
            flex-direction:column;
            align-items:flex-start;
          }

          .status{
            width:100%;
            text-align:center;
          }

          .preview-box{
            height:400px;
            border-radius:16px;
          }

          .details-header{
            font-size:18px;
          }

          .detail-key,
          .detail-value{
            font-size:14px;
          }

          .btn{
            padding:13px;
            font-size:14px;
            border-radius:14px;
          }

          input{
            font-size:14px;
            border-radius:14px;
          }

          .qr-title{
            font-size:18px;
          }

          .qr-wrapper{
            padding:14px;
          }

          .qr-text{
            font-size:12px;
          }

          iframe{
            min-height:400px;
          }
        }

      `}</style>

      <div className="dashboard">

        <div className="main-card">

          <div className="header">

            <div className="title-section">

              <h1>
                Certificate Generator
              </h1>

              <p>
                Generate and preview certificates instantly
              </p>

            </div>

            <div className="badge">
              <Sparkles size={18} />
              Smart PDF Automation
            </div>

          </div>

          <div className="content">

            {/* LEFT PANEL */}
            <div className="left-panel">

              <div className="panel-title">
                Applicant Search
              </div>

              <div className="input-box">

                <label>
                  Application ID
                </label>

                <div className="input-wrapper">

                  <Search size={18} />

                  <input
                    type="text"
                    placeholder="Enter Application ID"
                    value={applicationId}
                    onChange={(e) =>
                      setApplicationId(e.target.value)
                    }
                  />

                </div>

              </div>

              <button
                className="btn fetch-btn"
                onClick={fetchApplicant}
              >

                <Search size={18} />

                {loading
                  ? "Loading..."
                  : "Fetch Details"}

              </button>

              <button
                className="btn generate-btn"
                onClick={generateCertificate}
              >

                <BadgeCheck size={18} />

                Generate Certificate

              </button>

              {/* DETAILS */}
              {applicant && (

                <div className="details-card">

                  <div className="details-header">

                    <User size={20} />

                    Applicant Details

                  </div>

                  <div className="detail-row">

                    <div className="detail-key">
                      Application No
                    </div>

                    <div className="detail-value">
                      {applicant.application_id}
                    </div>

                  </div>

                  <div className="detail-row">

                    <div className="detail-key">
                      Name
                    </div>

                    <div className="detail-value">
                      {applicant.name}
                    </div>

                  </div>

                  <div className="detail-row">

                    <div className="detail-key">
                      DOB
                    </div>

                    <div className="detail-value">
                      {new Date(applicant.date_of_birth)
                        .toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                    </div>

                  </div>

                  <div className="detail-row">

                    <div className="detail-key">
                      Address
                    </div>

                    <div className="detail-value">
                      {applicant.address_part_1}
                    </div>

                  </div>

                </div>
              )}

              {/* DOWNLOAD */}
              {pdfUrl && (

                <button
                  className="btn download-btn"
                  onClick={downloadPDF}
                >

                  <Download size={18} />

                  Download Certificate

                </button>
              )}

            </div>

            {/* RIGHT PANEL */}
            <div className="right-panel">

              <div className="preview-header">

                <div className="preview-title">

                  <Eye size={24} />

                  Certificate Preview

                </div>

                <div className="status">
                  LIVE PREVIEW
                </div>

              </div>

              <div className="preview-box">

                {pdfUrl ? (

                  <iframe
                    src={pdfUrl}
                    title="PDF Preview"
                  />

                ) : (

                  <div className="empty-preview">

                    <FileText />

                    <h2>
                      No Certificate Generated
                    </h2>

                    <p>
                      Click Generate Certificate
                    </p>

                  </div>
                )}

              </div>
              {/*
              QR CODE
              {pdfUrl && (

                <div className="qr-section">

                  <div className="qr-title">
                    Certificate QR Code
                  </div>

                  <div className="qr-wrapper">

                    <QRCodeSVG
                      value={pdfUrl}
                      size={180}
                    />

                  </div>

                  <div className="qr-text">
                    Scan QR to Open Certificate
                  </div>

                </div>

              )}
              */}

            </div>

          </div>

        </div>

      </div>
    </>
  )
}