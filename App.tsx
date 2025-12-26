
import React, { useState, useRef, useEffect } from 'react';
import { Question } from './types';
import { POOL_U1_3, POOL_U4_6 } from './constants';
import { beautifyPortrait } from './services/geminiService';

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
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'NONE' | 'CORRECT' | 'WRONG'>('NONE');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes in seconds

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (phase === 'QUIZ' && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setPhase('CERT');
            playSound('final');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const playSound = (type: keyof typeof SOUNDS) => {
    if (audioRef.current) audioRef.current.src = SOUNDS[type];
    audioRef.current?.play().catch(() => {});
  };

  const startQuiz = () => {
    if (!processedPhoto) return; 
    const q13 = SHUFFLE(POOL_U1_3, 4);
    const q46 = SHUFFLE(POOL_U4_6, 16);
    const combined = [...q13, ...q46].sort(() => Math.random() - 0.5);
    setQuestions(combined);
    setTimeLeft(1200);
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target?.result as string;
        setUserPhoto(data);
        setProcessedPhoto(null);
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

    ctx.fillStyle = '#fffdf0';
    ctx.fillRect(0, 0, 1200, 800);
    ctx.strokeStyle = '#c5a059';
    ctx.lineWidth = 25;
    ctx.strokeRect(30, 30, 1140, 740);

    const finalPhoto = processedPhoto || userPhoto;
    if (finalPhoto) {
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
        continueDrawing();
      };
      img.src = finalPhoto;
    } else {
      continueDrawing();
    }

    function continueDrawing() {
      if (!ctx) return;
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

      ctx.textAlign = 'right';
      ctx.fillStyle = '#333';
      ctx.font = 'bold 20px "Quicksand"';
      ctx.fillText('GIÁO VIÊN BỘ MÔN', 1100, 620);
      ctx.font = '45px "Dancing Script"';
      ctx.fillStyle = '#1a237e';
      ctx.fillText('Đinh Văn Thành', 1100, 680);

      const link = document.createElement('a');
      link.download = `ChungNhan_${userName}_Anh6.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col items-center justify-start p-4 md:p-10 font-sans selection:bg-sky-200">
      <audio ref={audioRef} />

      {phase === 'REG' && (
        <div className="w-full max-w-sm bg-white p-8 rounded-[3rem] shadow-2xl mt-10 border-b-8 border-sky-200 animate-in fade-in slide-in-from-top-4">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-sky-600 mb-2 uppercase">Tiếng Anh 6 📝</h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Global Success • Kiểm tra HK1</p>
          </div>
          <div className="space-y-6">
            <div className="group">
                <label className="block text-xs font-black text-slate-400 mb-2 ml-4 uppercase">Họ và tên</label>
                <input 
                type="text" placeholder="Ví dụ: Đinh Quang Việt" 
                className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold border-2 border-transparent focus:border-sky-500 transition-all outline-none"
                value={userName} onChange={e => setUserName(e.target.value)}
                />
            </div>
            <div className="group">
                <label className="block text-xs font-black text-slate-400 mb-2 ml-4 uppercase">Lớp của em</label>
                <input 
                type="text" placeholder="Ví dụ: 6A1" 
                className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold border-2 border-transparent focus:border-sky-500 transition-all outline-none"
                value={userClass} onChange={e => setUserClass(e.target.value)}
                />
            </div>
            <button 
              disabled={!userName || !userClass}
              onClick={() => setPhase('PHOTO')}
              className="w-full bg-sky-600 text-white py-5 rounded-2xl font-black shadow-lg hover:shadow-sky-200 disabled:opacity-30 transition-all active:scale-95 uppercase tracking-widest"
            >
              Tiếp theo ➡️
            </button>
          </div>
          <p className="mt-8 text-center text-slate-400 text-[10px] font-black italic">Hệ thống ôn luyện của Thầy Đinh Văn Thành</p>
        </div>
      )}

      {phase === 'PHOTO' && (
        <div className="w-full max-w-sm bg-white p-6 rounded-[3rem] shadow-2xl mt-4 text-center animate-in zoom-in duration-300">
          <h2 className="text-2xl font-black text-slate-800 mb-6 uppercase tracking-tight">Ảnh Thẻ Học Sinh 🏷️</h2>
          
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />

          {!userPhoto ? (
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-16 bg-sky-50 text-sky-600 rounded-3xl border-4 border-dashed border-sky-200 flex flex-col items-center gap-4 active:scale-95 transition-all"
              >
                <span className="text-6xl">📸</span>
                <span className="font-black text-sm uppercase">Tải ảnh hoặc Chụp ảnh</span>
              </button>
              <p className="text-slate-400 text-[11px] font-bold">Lưu ý: Hãy chọn ảnh rõ mặt để AI xử lý đẹp nhất</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative inline-block rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white aspect-[3/4] w-full bg-slate-100">
                <img src={processedPhoto || userPhoto} alt="User" className="w-full h-full object-cover" />
                {isProcessing && (
                  <div className="absolute inset-0 bg-sky-950/80 backdrop-blur-md flex flex-col items-center justify-center text-white p-6">
                    <div className="w-12 h-12 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <span className="font-black text-[13px] tracking-widest uppercase text-center leading-relaxed">
                      AI đang xử lý chuyên nghiệp...<br/>
                      <span className="text-sky-300 text-[10px]">Làm đẹp da & Thay sơ mi học sinh</span>
                    </span>
                  </div>
                )}
                {processedPhoto && !isProcessing && (
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-lg animate-bounce">
                    ĐÃ SẴN SÀNG ✨
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="p-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase active:scale-95 transition-all"
                >
                  Chọn lại
                </button>
                <button 
                  onClick={handleBeautify} 
                  disabled={isProcessing} 
                  className="p-4 bg-sky-600 text-white rounded-2xl font-black text-xs uppercase shadow-md active:scale-95 transition-all hover:bg-sky-700 disabled:opacity-50"
                >
                  Tạo ảnh thẻ AI ✨
                </button>
              </div>

              <div className="pt-2">
                {!processedPhoto && !isProcessing && (
                  <p className="text-rose-600 text-[10px] font-black uppercase mb-4 animate-pulse">
                    ⚠️ Phải nhấn "Tạo ảnh thẻ AI" để tiếp tục!
                  </p>
                )}
                <button 
                  onClick={startQuiz} 
                  disabled={!processedPhoto || isProcessing}
                  className={`w-full py-5 rounded-2xl font-black text-lg shadow-lg active:scale-95 uppercase tracking-widest transition-all ${processedPhoto ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                >
                  Bắt đầu ôn luyện 🚀
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {phase === 'QUIZ' && (
        <div className="w-full max-w-sm md:max-w-xl animate-in slide-in-from-bottom-10">
           <div className="flex justify-between items-center mb-4 px-4 bg-white/60 backdrop-blur-md py-2 rounded-2xl border border-white shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⏱️</span>
                  <span className={`font-black text-lg ${timeLeft < 60 ? 'text-rose-600 animate-pulse' : 'text-slate-700'}`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Thí sinh: {userName}
                </div>
           </div>
           
           <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-b-8 border-sky-100">
                <div className="h-3 bg-slate-100 w-full relative">
                    <div className="h-full bg-sky-500 transition-all duration-700" style={{width: `${((currentIdx+1)/questions.length)*100}%`}} />
                </div>
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <span className="px-4 py-1 bg-sky-50 text-sky-600 rounded-full text-[10px] font-black uppercase tracking-widest">{questions[currentIdx].unit}</span>
                        <span className="font-black text-slate-300 text-sm">Câu {currentIdx + 1}/{questions.length}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-indigo-950 mb-8 leading-tight">
                        {questions[currentIdx].question}
                    </h3>
                    <div className="space-y-4">
                        {questions[currentIdx].options.map((opt, i) => {
                            const isCorrect = i === questions[currentIdx].correctAnswer;
                            
                            const bgColors = [
                              "bg-blue-50 border-blue-200 hover:bg-blue-100",
                              "bg-amber-50 border-amber-200 hover:bg-amber-100",
                              "bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
                              "bg-rose-50 border-rose-200 hover:bg-rose-100"
                            ];
                            const letterColors = [
                              "bg-blue-500 text-white",
                              "bg-amber-500 text-white",
                              "bg-emerald-500 text-white",
                              "bg-rose-500 text-white"
                            ];

                            let btnStyle = `w-full p-5 text-left rounded-2xl border-2 font-bold transition-all flex items-center gap-4 shadow-sm `;
                            if (feedback === 'NONE') {
                              btnStyle += `${bgColors[i % bgColors.length]} active:scale-98`;
                            } else if (isCorrect) {
                              btnStyle += "border-emerald-500 bg-emerald-100 text-emerald-900 animate-correct shadow-inner";
                            } else {
                              btnStyle += "border-slate-100 bg-white opacity-40";
                            }

                            return (
                                <button key={i} onClick={() => handleAnswer(i)} disabled={feedback !== 'NONE'} className={btnStyle}>
                                    <span className={`w-10 h-10 min-w-[2.5rem] rounded-xl flex items-center justify-center text-sm font-black shadow-md ${feedback === 'NONE' ? letterColors[i % letterColors.length] : isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                        {String.fromCharCode(65+i)}
                                    </span>
                                    <span className="text-slate-800">{opt}</span>
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
           <div className="w-full max-w-sm mb-4 text-center">
                <div className="inline-block px-8 py-3 bg-amber-400 text-white rounded-full font-black text-sm shadow-xl animate-bounce">
                    XUẤT SẮC HOÀN THÀNH! 🏆
                </div>
           </div>
           
           <div className="w-full max-w-md bg-[#fffdf0] rounded-xl border-[12px] border-[#c5a059] p-4 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-4 -left-4 w-12 h-12 border-4 border-rose-500/20 rounded-full opacity-30"></div>
                
                <div className="text-center mb-6 pr-4">
                    <h1 className="text-2xl font-bold text-[#8b4513] cert-font leading-tight uppercase">Giấy Chứng Nhận</h1>
                    <p className="text-[10px] italic text-slate-400 font-serif">Khen ngợi nỗ lực học tập xuất sắc - HK1</p>
                </div>
                
                <div className="flex gap-4 items-start mb-6">
                    <div className="flex-1 text-center pl-2">
                        <h2 className="text-2xl font-black text-rose-700 mb-2 underline decoration-[#c5a059]/30 underline-offset-8">
                            {userName.toUpperCase()}
                        </h2>
                        <p className="text-sm font-bold text-slate-700 mb-4">Lớp: {userClass}</p>
                        
                        <div className="bg-white/70 p-4 rounded-3xl border-2 border-[#c5a059]/20 shadow-sm inline-block">
                            <p className="text-[10px] font-bold text-slate-500 mb-1">Điểm số đạt được:</p>
                            <p className="text-3xl font-black text-emerald-600 leading-none">{score}/{questions.length || 20}</p>
                        </div>
                    </div>

                    <div className="shrink-0">
                        <div className="bg-white p-1 shadow-md border-2 border-[#c5a059]/20 rotate-1">
                            {processedPhoto ? (
                                <img src={processedPhoto} className="w-20 aspect-[3/4] object-cover" />
                            ) : (
                                <div className="w-20 aspect-[3/4] bg-slate-100 flex items-center justify-center text-[8px] text-slate-300 font-bold uppercase">No Photo</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-end mt-4">
                    <div className="opacity-40">
                         <div className="w-16 h-16 border-4 border-rose-500 rounded-full flex items-center justify-center text-[6px] font-black text-rose-500 -rotate-12 border-dashed">
                            <span className="text-center font-bold">ENGLISH<br/>APPROVED</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-4">GIÁO VIÊN BỘ MÔN</p>
                        <div className="relative">
                            <p className="sig-font text-3xl text-indigo-900 absolute -top-8 right-0 w-full opacity-70 -rotate-3">Đinh Văn Thành</p>
                            <p className="font-black text-slate-800 border-t-2 border-slate-200 pt-1 text-xs uppercase tracking-tighter">Đinh Văn Thành</p>
                        </div>
                    </div>
                </div>
           </div>

           <div className="w-full max-w-sm mt-8 space-y-4">
                <button onClick={downloadCert} className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3">
                    LƯU BẢN ĐẸP 💾
                </button>
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={startQuiz} className="bg-sky-600 text-white py-4 rounded-2xl font-black text-sm shadow-md active:scale-95 transition-all">
                        LUYỆN LẠI ⚔️
                    </button>
                    <button onClick={() => window.location.reload()} className="bg-white border-2 border-slate-200 text-slate-400 py-4 rounded-2xl font-black text-sm active:scale-95 transition-all">
                        THOÁT 🔄
                    </button>
                </div>
           </div>
           <p className="mt-8 text-[9px] text-slate-400 font-black uppercase tracking-widest text-center">Học sinh chụp ảnh màn hình hoặc tải bản đẹp để gửi Thầy nhé!</p>
        </div>
      )}
    </div>
  );
};

export default App;
