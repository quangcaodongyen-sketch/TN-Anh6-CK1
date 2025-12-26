
import React, { useState, useRef, useEffect } from 'react';
import { QuizState, Question } from './types';
import { POOL_U1_3, POOL_U4_6 } from './constants';
import { getAIExtraExplanation, beautifyPortrait } from './services/geminiService';

const SHUFFLE = <T,>(arr: T[], count: number): T[] => {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, count);
};

const SOUNDS = {
  correct: "https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3",
  wrong: "https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3",
  final: "https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3"
};

const PRAISE_MESSAGES = [
  "Tuyệt vời ông mặt trời! 🏆",
  "Tư duy quá đỉnh, thầy rất hãnh diện về em! 😎",
  "IQ vô cực là đây chứ đâu! 🧠✨",
  "Bậc thầy tiếng Anh tương lai đây rồi! 🎓",
  "Đúng là 'chiến thần' lớp mình! 🌟",
  "Thầy Thành xin bái phục sự thông minh này! 🙏"
];

const ENCOURAGE_MESSAGES = [
  "Suýt soát luôn, cố gắng câu sau nhé! 😂",
  "Sai một ly đi một dặm, nhưng không sao, làm lại nào! 🏃‍♂️",
  "Kiến thức đang nạp vào, câu sau sẽ 'nổ' đáp án đúng! 🕊️",
  "Đừng nản lòng, quan trọng là em đã biết mình sai ở đâu! 💡"
];

const App: React.FC = () => {
  const [phase, setPhase] = useState<'REG' | 'PHOTO' | 'QUIZ' | 'CERT'>('REG');
  const [userName, setUserName] = useState('');
  const [userClass, setUserClass] = useState('');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [processedPhoto, setProcessedPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraMode, setCameraMode] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'NONE' | 'CORRECT' | 'WRONG'>('NONE');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const playSound = (type: keyof typeof SOUNDS) => {
    if (audioRef.current) audioRef.current.src = SOUNDS[type];
    audioRef.current?.play().catch(() => {});
  };

  const startQuiz = () => {
    // Luôn đảo 50-70% bằng cách chọn ngẫu nhiên từ pool lớn
    const q13 = SHUFFLE(POOL_U1_3, 4);
    const q46 = SHUFFLE(POOL_U4_6, 16);
    const combined = [...q13, ...q46].sort(() => Math.random() - 0.5);
    setQuestions(combined);
    setPhase('QUIZ');
    setCurrentIdx(0);
    setScore(0);
    setFeedback('NONE');
  };

  const handleAnswer = (idx: number) => {
    if (feedback !== 'NONE') return;
    const isCorrect = idx === questions[currentIdx].correctAnswer;
    if (isCorrect) {
      setScore(s => s + 1);
      setFeedback('CORRECT');
      setFeedbackMsg(PRAISE_MESSAGES[Math.floor(Math.random() * PRAISE_MESSAGES.length)]);
      playSound('correct');
      // @ts-ignore
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } else {
      setFeedback('WRONG');
      setFeedbackMsg(ENCOURAGE_MESSAGES[Math.floor(Math.random() * ENCOURAGE_MESSAGES.length)]);
      playSound('wrong');
    }
    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(i => i + 1);
        setFeedback('NONE');
      } else {
        setPhase('CERT');
        playSound('final');
      }
    }, 2500); 
  };

  const initCamera = async () => {
    setCameraMode(true);
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => videoRef.current?.play();
      }
    } catch (err) {
      setCameraError("Không thể truy cập Camera.");
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context?.drawImage(videoRef.current, 0, 0);
      const data = canvasRef.current.toDataURL('image/jpeg');
      setUserPhoto(data);
      setProcessedPhoto(data);
      stopCamera();
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
    }
    setCameraMode(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target?.result as string;
        setUserPhoto(data);
        setProcessedPhoto(data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBeautify = async () => {
    if (!userPhoto) return;
    setIsProcessing(true);
    const result = await beautifyPortrait(userPhoto);
    setProcessedPhoto(result);
    setIsProcessing(false);
  };

  const downloadCert = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background & Borders
    ctx.fillStyle = '#fffdf0';
    ctx.fillRect(0, 0, 1200, 800);
    ctx.strokeStyle = '#c5a059';
    ctx.lineWidth = 25;
    ctx.strokeRect(30, 30, 1140, 740);

    // Text Content - Centered but away from the right photo area
    ctx.textAlign = 'center';
    ctx.fillStyle = '#8b4513';
    ctx.font = 'bold 70px "Playfair Display"';
    ctx.fillText('GIẤY CHỨNG NHẬN', 550, 160);

    ctx.font = 'italic 25px "Quicksand"';
    ctx.fillText('Khen ngợi nỗ lực học tập xuất sắc - HK1', 550, 210);

    ctx.fillStyle = '#d32f2f';
    ctx.font = 'bold 60px "Quicksand"';
    ctx.fillText(userName.toUpperCase(), 550, 310);

    ctx.fillStyle = '#333';
    ctx.font = 'bold 35px "Quicksand"';
    ctx.fillText(`Lớp: ${userClass}`, 550, 370);

    ctx.font = '26px "Quicksand"';
    ctx.fillText('Đã chinh phục thành công 20 thử thách tiếng Anh 6', 550, 430);
    ctx.font = 'bold 45px "Quicksand"';
    ctx.fillStyle = '#1a237e';
    ctx.fillText(`SCORE: ${score}/${questions.length} (${Math.round(score/2)} điểm)`, 550, 500);

    // Signature Box
    ctx.textAlign = 'right';
    ctx.fillStyle = '#333';
    ctx.font = 'bold 20px "Quicksand"';
    ctx.fillText('GIÁO VIÊN BỘ MÔN', 1100, 620);
    ctx.font = '45px "Dancing Script"';
    ctx.fillStyle = '#1a237e';
    ctx.fillText('Đinh Văn Thành', 1100, 680);

    // Photo Placement - TOP RIGHT corner
    if (processedPhoto) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.fillRect(920, 60, 220, 280);
        ctx.strokeStyle = '#c5a059';
        ctx.lineWidth = 6;
        ctx.strokeRect(920, 60, 220, 280);
        ctx.drawImage(img, 930, 70, 200, 260);
        ctx.restore();
        
        const link = document.createElement('a');
        link.download = `ChungNhan_${userName}_Anh6.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      };
      img.src = processedPhoto;
    } else {
      const link = document.createElement('a');
      link.download = `ChungNhan_${userName}_Anh6.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col items-center justify-start p-4 md:p-10 font-sans selection:bg-sky-200">
      <audio ref={audioRef} />
      <canvas ref={canvasRef} className="hidden" />

      {phase === 'REG' && (
        <div className="w-full max-w-sm bg-white p-8 rounded-[3rem] shadow-2xl mt-10 border-b-8 border-sky-200 animate-in fade-in slide-in-from-top-4">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-sky-600 mb-2">TIẾNG ANH 6 📝</h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Global Success • Kiểm tra HK1</p>
          </div>
          <div className="space-y-6">
            <div className="group">
                <label className="block text-xs font-black text-slate-400 mb-2 ml-4">HỌ VÀ TÊN</label>
                <input 
                type="text" placeholder="Ví dụ: Đinh Quang Việt" 
                className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold border-2 border-transparent focus:border-sky-500 transition-all outline-none"
                value={userName} onChange={e => setUserName(e.target.value)}
                />
            </div>
            <div className="group">
                <label className="block text-xs font-black text-slate-400 mb-2 ml-4">LỚP CỦA EM</label>
                <input 
                type="text" placeholder="Ví dụ: 6A1" 
                className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold border-2 border-transparent focus:border-sky-500 transition-all outline-none"
                value={userClass} onChange={e => setUserClass(e.target.value)}
                />
            </div>
            <button 
              disabled={!userName || !userClass}
              onClick={() => setPhase('PHOTO')}
              className="w-full bg-sky-600 text-white py-5 rounded-2xl font-black shadow-lg hover:shadow-sky-200 disabled:opacity-30 transition-all active:scale-95"
            >
              TIẾP THEO ➡️
            </button>
          </div>
          <p className="mt-8 text-center text-slate-400 text-[10px] font-black italic">Hệ thống ôn luyện của Thầy Đinh Văn Thành</p>
        </div>
      )}

      {phase === 'PHOTO' && (
        <div className="w-full max-w-sm bg-white p-6 rounded-[3rem] shadow-2xl mt-4 text-center animate-in zoom-in duration-300">
          <h2 className="text-2xl font-black text-slate-800 mb-6 uppercase">Ảnh Thẻ Học Sinh 🏷️</h2>
          
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />

          {!userPhoto && !cameraMode ? (
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={initCamera}
                className="w-full py-8 bg-sky-50 text-sky-600 rounded-3xl border-4 border-dashed border-sky-200 flex flex-col items-center gap-3 active:scale-95 transition-all"
              >
                <span className="text-4xl">📸</span>
                <span className="font-black text-sm uppercase">Chụp ảnh ngay</span>
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-8 bg-indigo-50 text-indigo-600 rounded-3xl border-4 border-dashed border-indigo-200 flex flex-col items-center gap-3 active:scale-95 transition-all"
              >
                <span className="text-4xl">🖼️</span>
                <span className="font-black text-sm uppercase">Chọn từ thư viện</span>
              </button>
            </div>
          ) : cameraMode ? (
            <div className="relative rounded-[2rem] overflow-hidden bg-black aspect-[3/4] shadow-inner">
               <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover mirror" />
               <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 px-10">
                    <button onClick={() => setCameraMode(false)} className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold uppercase">Hủy</button>
                    <button onClick={takePhoto} className="w-16 h-16 bg-white rounded-full border-8 border-sky-500 shadow-xl"></button>
               </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative inline-block rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white aspect-[3/4] w-full bg-slate-100">
                <img src={processedPhoto!} alt="User" className="w-full h-full object-cover" />
                {isProcessing && (
                  <div className="absolute inset-0 bg-sky-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-white p-4">
                    <div className="w-10 h-10 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <span className="font-black text-[12px] tracking-widest uppercase text-center">Đang Retouch AI...<br/>Giữ mặt gốc & Thay áo sơ mi</span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => {setUserPhoto(null); setCameraMode(false);}} className="p-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase">Chọn lại</button>
                <button onClick={handleBeautify} disabled={isProcessing} className="p-4 bg-sky-600 text-white rounded-2xl font-black text-xs uppercase shadow-md active:scale-95">Làm đẹp AI ✨</button>
              </div>
              <button onClick={startQuiz} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg shadow-lg active:scale-95 uppercase tracking-wider">Bắt đầu thi đấu! 🚀</button>
            </div>
          )}
        </div>
      )}

      {phase === 'QUIZ' && (
        <div className="w-full max-w-sm md:max-w-xl animate-in slide-in-from-bottom-10">
           <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
                <div className="h-3 bg-slate-100 w-full relative">
                    <div className="h-full bg-sky-500 transition-all duration-700" style={{width: `${((currentIdx+1)/questions.length)*100}%`}} />
                </div>
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <span className="px-4 py-1 bg-sky-50 text-sky-600 rounded-full text-[10px] font-black">{questions[currentIdx].unit}</span>
                        <span className="font-black text-slate-300 text-sm">{currentIdx + 1}/{questions.length}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-8 leading-tight">
                        {questions[currentIdx].question}
                    </h3>
                    <div className="space-y-3">
                        {questions[currentIdx].options.map((opt, i) => {
                            const isCorrect = i === questions[currentIdx].correctAnswer;
                            let btnStyle = "w-full p-5 text-left rounded-2xl border-2 font-bold transition-all flex items-center gap-4 ";
                            if (feedback === 'NONE') btnStyle += "border-slate-50 bg-slate-50 hover:border-sky-300 hover:bg-white active:scale-98";
                            else if (isCorrect) btnStyle += "border-emerald-500 bg-emerald-50 text-emerald-800 animate-correct";
                            else btnStyle += "border-slate-100 bg-white opacity-40";

                            return (
                                <button key={i} onClick={() => handleAnswer(i)} disabled={feedback !== 'NONE'} className={btnStyle}>
                                    <span className={`w-8 h-8 min-w-[2rem] rounded-lg flex items-center justify-center text-xs font-black ${feedback === 'NONE' ? 'bg-white text-slate-400' : isCorrect ? 'bg-emerald-500 text-white' : 'bg-slate-100'}`}>
                                        {String.fromCharCode(65+i)}
                                    </span>
                                    {opt}
                                </button>
                            );
                        })}
                    </div>
                    {feedback !== 'NONE' && (
                        <div className={`mt-6 p-5 rounded-2xl animate-in zoom-in-50 border-2 ${feedback === 'CORRECT' ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                            <p className="font-black text-sm mb-2">{feedbackMsg}</p>
                            <p className="text-xs font-medium text-slate-600 italic leading-relaxed">{questions[currentIdx].explanation}</p>
                        </div>
                    )}
                </div>
           </div>
        </div>
      )}

      {phase === 'CERT' && (
        <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-1000 mb-20 px-4">
           <div className="w-full max-w-sm mb-6 text-center">
                <div className="inline-block px-8 py-3 bg-amber-400 text-white rounded-full font-black text-sm shadow-xl animate-bounce">
                    XUẤT SẮC HOÀN THÀNH! 🏆
                </div>
           </div>
           
           {/* Mobile Scaled Preview */}
           <div className="relative w-full flex justify-center items-start h-[45vh] md:h-auto overflow-hidden bg-slate-200 rounded-3xl shadow-inner border-4 border-white">
                <div className="origin-top scale-[0.28] md:scale-100 transition-transform duration-500" 
                     style={{ 
                         width: '1200px', 
                         height: '800px', 
                         minWidth: '1200px',
                         background: '#fffdf0',
                         border: '25px solid #c5a059',
                         padding: '60px',
                         position: 'relative',
                         boxShadow: '0 50px 100px -20px rgba(0,0,0,0.3)'
                     }}>
                    <h1 className="text-8xl text-center font-bold text-[#8b4513] mb-4 cert-font pr-40">GIẤY CHỨNG NHẬN</h1>
                    <p className="text-center italic text-3xl mb-12 text-slate-400 font-serif pr-40">Khen ngợi nỗ lực học tập xuất sắc - Học kỳ 1</p>
                    
                    <div className="flex justify-between items-start px-10">
                        <div className="flex-1 pt-10 text-center pr-20">
                            <h2 className="text-8xl font-black text-rose-700 mb-6 underline decoration-[#c5a059]/30 underline-offset-[25px]">{userName.toUpperCase()}</h2>
                            <p className="text-5xl font-black text-slate-700 mb-14">Lớp: {userClass}</p>
                            
                            <div className="bg-white/70 p-12 rounded-[4rem] border-4 border-[#c5a059]/20 shadow-2xl inline-block">
                                <p className="text-3xl font-bold text-slate-600 mb-6 italic">Đã chinh phục thành công các thử thách tiếng Anh 6</p>
                                <p className="text-7xl font-black text-emerald-600 tracking-tighter">SCORE: {score}/{questions.length}</p>
                            </div>
                        </div>

                        {/* Photo in isolated frame area */}
                        <div className="relative pt-10">
                            <div className="bg-white p-4 shadow-2xl border-4 border-[#c5a059]/20 rotate-2">
                                {processedPhoto ? (
                                    <img src={processedPhoto} className="w-48 aspect-[3/4] object-cover" />
                                ) : (
                                    <div className="w-48 aspect-[3/4] bg-slate-100 flex items-center justify-center text-slate-300 font-bold uppercase">No Photo</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-20 right-20 text-right">
                        <p className="font-black text-slate-400 mb-20 text-sm uppercase tracking-widest">GIÁO VIÊN BỘ MÔN</p>
                        <p className="sig-font text-9xl text-indigo-900 absolute -top-12 right-0 w-full opacity-80 -rotate-3 select-none pointer-events-none">Đinh Văn Thành</p>
                        <p className="mt-14 font-black text-slate-800 border-t-8 border-slate-200 pt-4 px-16 text-5xl uppercase tracking-tighter">Đinh Văn Thành</p>
                        {/* Stamp */}
                        <div className="absolute -top-16 -left-48 w-44 h-44 border-8 border-rose-500/40 rounded-full flex items-center justify-center text-sm font-black text-rose-500/40 -rotate-12 border-dashed">
                            <span className="text-center">ENGLISH NINJA<br/>MR. THANH<br/>APPROVED</span>
                        </div>
                    </div>
                </div>
           </div>

           <div className="w-full max-w-sm mt-12 space-y-4 px-4">
                <button onClick={downloadCert} className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black text-xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3">
                    LƯU CHỨNG NHẬN 💾
                </button>
                <button onClick={startQuiz} className="w-full bg-sky-600 text-white py-5 rounded-3xl font-black text-lg shadow-lg active:scale-95 transition-all">
                    TIẾP TỤC CHINH PHỤC ⚔️
                </button>
                <button onClick={() => window.location.reload()} className="w-full bg-white border-2 border-slate-200 text-slate-400 py-4 rounded-3xl font-black text-xs uppercase tracking-widest active:scale-95">
                    Thi lại từ đầu 🔄
                </button>
           </div>
           <p className="mt-10 text-[10px] text-slate-400 font-black uppercase tracking-widest opacity-50 text-center">Global Success • Grade 6 English • Semester 1</p>
        </div>
      )}
    </div>
  );
};

export default App;
