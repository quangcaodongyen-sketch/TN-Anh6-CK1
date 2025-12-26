
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
  "Đỉnh của chóp luôn em ơi! 🏆",
  "Tư duy quá sắc bén, thầy rất ấn tượng! 😎",
  "Não bộ 1000 IQ là đây chứ đâu! 🧠✨",
  "Học thế này thì tương lai rộng mở nhé! 🎓",
  "Đúng là 'chiến thần' tiếng Anh lớp mình! 🌟",
  "Thầy Thành xin bái phục sự thông minh này! 🙏",
  "Tiếng Anh của em 'mượt' như lụa vậy! 🌊",
  "Kiến thức rất vững vàng, cố gắng phát huy em nhé! 💖"
];

const ENCOURAGE_MESSAGES = [
  "Gần đúng rồi, một chút nhầm lẫn nhỏ thôi! 😂",
  "Sai để nhớ lâu hơn, đừng nản lòng em nhé! 🏃‍♂️",
  "Kiến thức đang nạp vào máy, câu sau sẽ chuẩn xác hơn! 🕊️",
  "Câu này hơi 'lắt léo', chú ý kỹ cấu trúc thầy dặn nha! 🥔",
  "Đừng buồn, quan trọng là em đã hiểu ra lỗi sai! 💡",
  "Aiii, suýt chút nữa là hoàn hảo rồi! Tập trung cao độ nào! 🔥",
  "Đáp án đúng đang đợi em ở câu tiếp theo, cố lên! 💻",
  "Sai lầm là mẹ thành công, xem kỹ giải thích của thầy nhé! 🚀"
];

const App: React.FC = () => {
  const [phase, setPhase] = useState<'REG' | 'PHOTO' | 'QUIZ' | 'CERT'>('REG');
  const [userName, setUserName] = useState('');
  const [userClass, setUserClass] = useState('');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [processedPhoto, setProcessedPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
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
    // Lấy 4 câu từ Unit 1-3 và 16 câu từ Unit 4-6 để đảm bảo kiến thức trọng tâm
    // Shuffle liên tục giúp bộ câu hỏi thay đổi ít nhất 50% mỗi lần chơi
    const q13 = SHUFFLE(POOL_U1_3, 4);
    const q46 = SHUFFLE(POOL_U4_6, 16);
    setQuestions([...q13, ...q46].sort(() => Math.random() - 0.5));
    setPhase('QUIZ');
    setCurrentIdx(0);
    setScore(0);
    setFeedback('NONE');
  };

  const handleAnswer = async (idx: number) => {
    if (feedback !== 'NONE') return;
    const isCorrect = idx === questions[currentIdx].correctAnswer;
    if (isCorrect) {
      setScore(s => s + 1);
      setFeedback('CORRECT');
      setFeedbackMsg(PRAISE_MESSAGES[Math.floor(Math.random() * PRAISE_MESSAGES.length)]);
      playSound('correct');
      // @ts-ignore
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
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
    }, 2800); 
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result as string;
        setUserPhoto(data);
        setProcessedPhoto(data);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  const stopCamera = () => {
    // @ts-ignore
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(t => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const initCamera = async () => {
    setCameraError(null);
    stopCamera();
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Trình duyệt không hỗ trợ camera.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 800 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => videoRef.current?.play().catch(() => {});
      }
    } catch (err: any) {
      setCameraError("Lỗi kết nối camera.");
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

    // Background
    ctx.fillStyle = '#fffdf0';
    ctx.fillRect(0, 0, 1200, 800);
    
    // Borders
    ctx.strokeStyle = '#c5a059';
    ctx.lineWidth = 30;
    ctx.strokeRect(40, 40, 1120, 720);
    ctx.lineWidth = 5;
    ctx.strokeRect(60, 60, 1080, 680);
    
    ctx.textAlign = 'center';
    ctx.fillStyle = '#8b4513';
    ctx.font = 'bold 75px "Playfair Display", serif';
    ctx.fillText('GIẤY CHỨNG NHẬN', 600, 160);
    
    ctx.font = 'italic 28px "Quicksand"';
    ctx.fillText('Vinh danh nỗ lực học tập của học sinh', 600, 210);
    
    ctx.fillStyle = '#d32f2f';
    ctx.font = 'bold 60px "Quicksand"';
    ctx.fillText(userName.toUpperCase(), 600, 290);
    
    ctx.fillStyle = '#333';
    ctx.font = 'bold 35px "Quicksand"';
    ctx.fillText(`Lớp: ${userClass}`, 600, 350);
    
    ctx.font = '28px "Quicksand"';
    ctx.fillText(`Đã xuất sắc hoàn thành khóa ôn tập kiến thức Tiếng Anh 6 - Học kỳ 1`, 600, 410);
    ctx.fillText(`Kết quả: ${Math.round((score/questions.length)*10)}/10 điểm (${score}/${questions.length} câu đúng)`, 600, 460);
    
    ctx.font = 'bold 45px "Quicksand"';
    ctx.fillStyle = '#1a237e';
    const title = score >= 18 ? "DANH HIỆU: SIÊU SAO TIẾNG ANH 🌟" : score >= 15 ? "DANH HIỆU: CHIẾN BINH NGỮ PHÁP ⚔️" : "DANH HIỆU: HỌC SINH TIỀM NĂNG 🌱";
    ctx.fillText(title, 600, 540);

    // Signature Area
    ctx.textAlign = 'center';
    ctx.fillStyle = '#333';
    ctx.font = 'bold 22px "Quicksand"';
    ctx.fillText('GIÁO VIÊN BỘ MÔN', 950, 620);
    ctx.font = '50px "Dancing Script", cursive';
    ctx.fillStyle = '#1a237e';
    ctx.fillText('Đinh Văn Thành', 950, 690);

    // ONE Funny Stamp
    const drawFunnySeal = (x: number, y: number) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-0.15);
        ctx.strokeStyle = 'rgba(211, 47, 47, 0.8)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, 75, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 68, 0, Math.PI * 2);
        ctx.stroke();
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(211, 47, 47, 0.8)';
        ctx.font = 'bold 12px "Quicksand"';
        ctx.fillText('ENGLISH NINJA', 0, -35);
        ctx.font = 'bold 18px "Quicksand"';
        ctx.fillText('APPROVED', 0, 0);
        ctx.font = 'bold 12px "Quicksand"';
        ctx.fillText('100% QUALITY', 0, 35);
        ctx.restore();
    }
    drawFunnySeal(800, 660);

    // Photo Placement (Slightly to the left bottom, avoiding center text)
    if (processedPhoto) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        ctx.drawImage(img, 120, 520, 180, 220);
        ctx.strokeStyle = '#c5a059';
        ctx.lineWidth = 5;
        ctx.strokeRect(120, 520, 180, 220);
        
        const link = document.createElement('a');
        link.download = `ChungNhan_Anh6_${userName}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      };
      img.src = processedPhoto;
    } else {
        const link = document.createElement('a');
        link.download = `ChungNhan_Anh6_${userName}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-purple-50 flex flex-col items-center p-4">
      <audio ref={audioRef} />
      
      {phase === 'REG' && (
        <div className="w-full max-w-md bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] mt-10 animate-in fade-in zoom-in border-4 border-sky-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-100 rounded-bl-full opacity-50 -mr-10 -mt-10"></div>
          <div className="text-center mb-8">
             <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 mb-2">HỆ THỐNG LUYỆN THI 🎓</h1>
             <p className="text-gray-500 font-black uppercase text-[10px] tracking-[0.2em] bg-slate-50 inline-block px-4 py-1 rounded-full border border-slate-100">Global Success • English 6</p>
          </div>
          <div className="space-y-6">
            <input 
              type="text" placeholder="Nhập Họ và Tên của em..." 
              className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-sky-500 focus:bg-white outline-none transition-all font-bold text-sky-900 shadow-sm"
              value={userName} onChange={e => setUserName(e.target.value)}
            />
            <input 
              type="text" placeholder="Nhập Lớp (Ví dụ: 6A1)..." 
              className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-sky-500 focus:bg-white outline-none transition-all font-bold text-sky-900 shadow-sm"
              value={userClass} onChange={e => setUserClass(e.target.value)}
            />
            <button 
              disabled={!userName || !userClass}
              onClick={() => { setPhase('PHOTO'); initCamera(); }}
              className="w-full bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:shadow-indigo-500/40 disabled:opacity-50 transition-all active:scale-95"
            >
              TIẾP THEO: CHỤP ẢNH THẺ 📸
            </button>
          </div>
          <p className="mt-8 text-center text-slate-400 text-xs font-bold italic">Thầy Đinh Văn Thành chúc các em bứt phá điểm số!</p>
        </div>
      )}

      {phase === 'PHOTO' && (
        <div className="w-full max-w-lg bg-white p-6 rounded-[2.5rem] shadow-2xl mt-6 text-center border-4 border-indigo-50">
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 mb-6 uppercase tracking-wider">ẢNH THẺ CỦA EM 🏷️</h2>
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
          
          {!userPhoto ? (
            <div className="space-y-6">
              <div className="relative rounded-[2rem] overflow-hidden bg-slate-900 aspect-[4/5] flex items-center justify-center border-8 border-slate-50 shadow-2xl">
                {cameraError ? (
                  <div className="p-10 text-white text-center w-full h-full flex flex-col items-center justify-center space-y-6 bg-gradient-to-br from-rose-600 to-rose-900">
                    <p className="font-bold text-lg">{cameraError}</p>
                    <button onClick={initCamera} className="px-10 py-4 bg-white text-rose-900 rounded-full font-black shadow-lg">THỬ LẠI CAMERA</button>
                  </div>
                ) : (
                  <>
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover mirror" />
                    <button onClick={takePhoto} className="absolute bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-full border-[10px] border-indigo-500/20 shadow-2xl flex items-center justify-center active:scale-90 transition-all hover:scale-110">
                      <div className="w-12 h-12 bg-indigo-500 rounded-full border-4 border-white"></div>
                    </button>
                  </>
                )}
              </div>
              <button onClick={() => fileInputRef.current?.click()} className="w-full py-5 bg-indigo-50 text-indigo-600 rounded-2xl font-black border-2 border-dashed border-indigo-200 hover:bg-indigo-100 transition-colors">CHỌN ẢNH TỪ MÁY 📁</button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative inline-block rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white">
                <img src={processedPhoto!} alt="User" className="w-64 aspect-[4/5] object-cover" />
                {isProcessing && (
                  <div className="absolute inset-0 bg-indigo-950/70 backdrop-blur-md flex flex-col items-center justify-center text-white p-8">
                    <div className="w-12 h-12 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <span className="font-black tracking-widest text-xs uppercase">ĐANG PHÙ PHÉP AI... ✨</span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => { setUserPhoto(null); initCamera(); }} className="p-5 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-colors">CHỌN ẢNH KHÁC</button>
                <button onClick={handleBeautify} disabled={isProcessing} className="p-5 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-colors">LÀM ĐẸP AI ✨</button>
              </div>
              <button onClick={startQuiz} className="w-full bg-emerald-600 text-white py-6 rounded-2xl font-black text-2xl shadow-xl active:scale-95 transition-all hover:bg-emerald-700">SẴN SÀNG THI ĐẤU! 🚀</button>
            </div>
          )}
        </div>
      )}

      {phase === 'QUIZ' && (
        <div className="w-full max-w-2xl mt-4 animate-in fade-in slide-in-from-bottom-10 px-2">
          <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border-b-[16px] border-slate-100">
            <div className="h-5 bg-slate-50 relative overflow-hidden">
               <div className="h-full bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 transition-all duration-1000" style={{width: `${((currentIdx+1)/questions.length)*100}%`}} />
            </div>
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-center mb-8">
                <span className="bg-orange-100 text-orange-700 px-5 py-2 rounded-2xl text-[10px] font-black uppercase shadow-sm">Câu {currentIdx + 1} / {questions.length}</span>
                <span className="bg-indigo-50 text-indigo-700 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-indigo-100">{questions[currentIdx].unit}</span>
              </div>
              <h3 className={`text-2xl md:text-3xl font-black text-slate-800 mb-12 leading-tight transition-colors ${feedback === 'CORRECT' ? 'text-emerald-600' : feedback === 'WRONG' ? 'text-rose-600' : ''}`}>
                {questions[currentIdx].question}
              </h3>
              <div className="grid grid-cols-1 gap-4 mb-10">
                {questions[currentIdx].options.map((opt, i) => {
                  const isCorrect = i === questions[currentIdx].correctAnswer;
                  let style = "w-full p-6 text-left rounded-[2rem] border-4 font-black text-xl transition-all flex items-center group ";
                  if (feedback === 'NONE') style += "border-slate-50 bg-white hover:border-sky-400 hover:bg-sky-50/50 hover:translate-x-3 hover:shadow-lg";
                  else if (isCorrect) style += "bg-emerald-50 border-emerald-500 text-emerald-900 scale-[1.03] shadow-xl";
                  else style += "bg-slate-50 border-slate-100 text-slate-300 opacity-40 grayscale";
                  const colors = ['bg-rose-500', 'bg-amber-500', 'bg-sky-500', 'bg-purple-500'];
                  return (
                    <button key={i} onClick={() => handleAnswer(i)} disabled={feedback !== 'NONE'} className={style}>
                      <span className={`w-12 h-12 min-w-[3rem] rounded-2xl flex items-center justify-center mr-6 text-white shadow-lg ${feedback === 'NONE' ? colors[i % colors.length] : isCorrect ? 'bg-emerald-500 animate-bounce' : 'bg-slate-300'}`}>
                        {String.fromCharCode(65 + i)}
                      </span> 
                      {opt}
                    </button>
                  );
                })}
              </div>
              {feedback !== 'NONE' && (
                <div className={`mt-6 p-8 rounded-[2.5rem] animate-in zoom-in border-4 shadow-xl ${feedback === 'CORRECT' ? 'bg-emerald-50 border-emerald-200 shadow-emerald-200/20' : 'bg-rose-50 border-rose-200 shadow-rose-200/20'}`}>
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="text-6xl animate-bounce drop-shadow-md">{feedback === 'CORRECT' ? '👨‍🎓' : '👨‍🏫'}</div>
                    <div className="text-center md:text-left">
                      <p className={`text-2xl font-black mb-3 tracking-tight ${feedback === 'CORRECT' ? 'text-emerald-700' : 'text-rose-700'}`}>{feedbackMsg}</p>
                      <p className="text-slate-800 font-bold leading-relaxed text-lg italic bg-white/60 p-5 rounded-2xl border-2 border-dashed border-slate-200/50">{questions[currentIdx].explanation}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {phase === 'CERT' && (
        <div className="w-full max-w-6xl mt-4 animate-in zoom-in text-center mb-24 px-4">
          <div className="inline-block px-12 py-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-white rounded-full font-black text-2xl shadow-[0_15px_40px_rgba(245,158,11,0.4)] mb-12 animate-bounce border-4 border-white">
            🥇 VINH DANH CHIẾN BINH TIẾNG ANH 🥷
          </div>
          
          <div className="overflow-x-auto pb-12 scrollbar-hide">
            <div id="cert-preview" className="relative min-w-[1050px] bg-[#fffdf0] border-[30px] border-double border-[#c5a059] p-20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] rounded-sm mx-auto overflow-hidden ring-1 ring-[#c5a059]/50">
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/old-map.png')]" />
              
              {/* Corner Patterns */}
              <div className="absolute top-10 left-10 w-40 h-40 border-l-[12px] border-t-[12px] border-[#c5a059]/20 rounded-tl-[4rem]"></div>
              <div className="absolute top-10 right-10 w-40 h-40 border-r-[12px] border-t-[12px] border-[#c5a059]/20 rounded-tr-[4rem]"></div>
              <div className="absolute bottom-10 left-10 w-40 h-40 border-l-[12px] border-b-[12px] border-[#c5a059]/20 rounded-bl-[4rem]"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 border-r-[12px] border-b-[12px] border-[#c5a059]/20 rounded-br-[4rem]"></div>

              <h1 className="cert-font text-8xl text-[#8b4513] mb-6 font-bold uppercase tracking-tight drop-shadow-sm">Giấy Chứng Nhận</h1>
              <p className="italic text-3xl text-gray-500 mb-10 font-serif tracking-widest opacity-70 uppercase">Thành tích học tập xuất sắc - Học kỳ 1</p>
              
              <h2 className="text-7xl font-black text-rose-700 underline underline-offset-[16px] decoration-[6px] decoration-double decoration-rose-300 mb-8 tracking-wider drop-shadow-sm">{userName.toUpperCase()}</h2>
              <div className="text-4xl font-black text-slate-800 mb-12 px-14 py-4 bg-[#c5a059]/10 inline-block rounded-[2.5rem] border-4 border-[#c5a059]/20 shadow-inner">Lớp: {userClass}</div>
              
              <div className="text-center bg-white/60 p-12 rounded-[3.5rem] border-8 border-[#c5a059]/10 backdrop-blur-xl shadow-2xl relative mx-auto max-w-[800px] mb-20">
                  <div className="absolute -top-10 -right-10 text-8xl animate-pulse">🏆</div>
                  <p className="text-3xl font-black text-slate-700 mb-6 leading-relaxed">
                    Đã hoàn thành xuất sắc thử thách kiến thức và chinh phục thành công ma trận ngữ pháp Tiếng Anh 6 - Global Success.
                  </p>
                  <p className="text-6xl font-black text-emerald-700 mb-6 tracking-tighter drop-shadow-sm">SCORE: {score}/{questions.length} ({Math.round((score/questions.length)*10)}/10)</p>
                  <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-700 via-indigo-700 to-purple-700 uppercase italic">
                    {score >= 18 ? "DANH HIỆU: SIÊU SAO TIẾNG ANH 🌟" : score >= 15 ? "DANH HIỆU: CHIẾN BINH NGỮ PHÁP ⚔️" : "DANH HIỆU: HỌC SINH TIỀM NĂNG 🌱"}
                  </p>
              </div>

              <div className="flex justify-between items-end px-10">
                {/* Photo in a safe corner */}
                <div className="relative group">
                  {processedPhoto && (
                    <img src={processedPhoto} className="w-52 aspect-[4/5] object-cover border-[12px] border-white shadow-[0_20px_40px_rgba(0,0,0,0.3)] bg-white z-10 relative rotate-2 group-hover:rotate-0 transition-transform duration-500" />
                  )}
                  <div className="absolute -inset-8 border-[6px] border-[#c5a059]/30 rounded-2xl pointer-events-none -rotate-3 group-hover:rotate-0 transition-transform duration-500"></div>
                </div>

                <div className="text-center relative min-w-[380px]">
                    {/* The One Approved Stamp */}
                    <div className="absolute -top-16 -left-32 w-44 h-44 border-8 border-rose-600/60 rounded-full flex items-center justify-center text-[16px] font-black text-rose-600/80 leading-tight pointer-events-none -rotate-12 bg-rose-50/5 backdrop-blur-[2px] shadow-sm">
                      <span className="text-center scale-110">ENGLISH NINJA<br/>APPROVED<br/>MR. THANH</span>
                    </div>

                    <p className="font-black mb-16 text-gray-800 tracking-[0.3em] text-sm uppercase opacity-60">GIÁO VIÊN BỘ MÔN</p>
                    <p className="sig-font text-8xl text-blue-950 absolute top-10 right-0 w-full opacity-90 -rotate-2 select-none pointer-events-none drop-shadow-sm">Đinh Văn Thành</p>
                    <p className="mt-32 font-black text-slate-800 border-t-[8px] border-slate-300 pt-4 inline-block px-16 text-4xl tracking-[0.2em] uppercase">Đinh Văn Thành</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 flex flex-col md:flex-row justify-center gap-6 px-4">
            <button 
              onClick={downloadCert} 
              className="bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700 text-white px-12 py-7 rounded-[2.5rem] font-black shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 text-2xl group border-4 border-white/30"
            >
              <span className="tracking-tight uppercase">Lưu chứng nhận</span>
              <span className="text-3xl group-hover:translate-y-2 transition-transform">📥</span>
            </button>
            <button 
              onClick={startQuiz} 
              className="bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-700 text-white px-12 py-7 rounded-[2.5rem] font-black shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 text-2xl group border-4 border-white/30"
            >
              <span className="tracking-tight uppercase">Tiếp tục chinh phục 🛡️</span>
              <span className="text-3xl group-hover:rotate-12 transition-transform">⚔️</span>
            </button>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-white border-[6px] border-sky-500 text-sky-600 px-12 py-7 rounded-[2.5rem] font-black hover:bg-sky-50 transition-all text-2xl shadow-xl active:scale-95 uppercase tracking-tight"
            >
              Thi lại từ đầu 🔄
            </button>
          </div>
          <p className="mt-12 text-slate-400 font-black italic tracking-widest text-sm uppercase opacity-50 text-center">TÀI LIỆU ÔN TẬP ĐỘC QUYỀN CỦA THẦY ĐINH VĂN THÀNH - GLOBAL SUCCESS 6</p>
        </div>
      )}
    </div>
  );
};

export default App;
