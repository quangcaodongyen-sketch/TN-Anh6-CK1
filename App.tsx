
import React, { useState, useRef, useEffect } from 'react';
import { Question, Difficulty } from './types';
import { QUESTIONS } from './constants';

const SHUFFLE = <T,>(arr: T[], count: number): T[] => {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, count);
};

const SOUNDS = {
  correct: "https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3",
  wrong: "https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3",
  final: "https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3"
};

const LEVEL_INFO = {
  BASIC: { label: "CƠ BẢN", rank: "Đồng", color: "#cd7f32", bg: "bg-orange-50", text: "text-orange-700" },
  INTERMEDIATE: { label: "KHÁ", rank: "Bạc", color: "#9ca3af", bg: "bg-slate-100", text: "text-slate-700" },
  ADVANCED: { label: "GIỎI", rank: "Vàng", color: "#fbbf24", bg: "bg-amber-50", text: "text-amber-700" }
};

const PRAISE_MESSAGES = ["Tuyệt vời! 🏆", "Đỉnh cao! 😎", "Quá giỏi! 🧠", "Xuất sắc! 🌟"];
const ENCOURAGE_MESSAGES = ["Cố lên nào! 💪", "Gần đúng rồi! 🏃", "Làm lại nhé! ✨"];

const FloatingPoint: React.FC<{ x: number, y: number }> = ({ x, y }) => (
  <div 
    className="fixed pointer-events-none text-emerald-600 font-black text-4xl animate-float-up-slow z-[100] drop-shadow-xl"
    style={{ left: x - 40, top: y - 20 }}
  >
    +10 XP ✨
  </div>
);

const App: React.FC = () => {
  const [phase, setPhase] = useState<'REG' | 'PHOTO' | 'QUIZ' | 'CERT'>('REG');
  const [userName, setUserName] = useState('');
  const [userClass, setUserClass] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('BASIC');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [lastQuestionIds, setLastQuestionIds] = useState<number[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [feedback, setFeedback] = useState<'NONE' | 'CORRECT' | 'WRONG'>('NONE');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [timeLeft, setTimeLeft] = useState(1200);
  const [floats, setFloats] = useState<{ id: number, x: number, y: number }[]>([]);

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
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, timeLeft]);

  const playSound = (type: keyof typeof SOUNDS) => {
    if (audioRef.current) audioRef.current.src = SOUNDS[type];
    audioRef.current?.play().catch(() => {});
  };

  const startQuiz = () => {
    const pool = QUESTIONS.filter(q => q.difficulty === difficulty);
    const vocabPool = pool.filter(q => q.unit === 'Vocabulary');
    const normalPool = pool.filter(q => q.unit !== 'Vocabulary');

    let selected: Question[] = [];
    const pickedVocab = SHUFFLE(vocabPool, 2);

    if (lastQuestionIds.length === 0) {
      const pickedNormal = SHUFFLE(normalPool, 18);
      selected = SHUFFLE([...pickedVocab, ...pickedNormal], 20);
    } else {
      const oldNormalIds = lastQuestionIds.filter(id => normalPool.some(q => q.id === id));
      const oldNormal = normalPool.filter(q => oldNormalIds.includes(q.id));
      const newNormal = normalPool.filter(q => !oldNormalIds.includes(q.id));
      // Thay mới 10 câu normal
      selected = SHUFFLE([...pickedVocab, ...SHUFFLE(oldNormal, 8), ...SHUFFLE(newNormal, 10)], 20);
    }
    
    setQuestions(selected);
    setLastQuestionIds(selected.map(q => q.id));
    setPhase('QUIZ');
    setCurrentIdx(0);
    setScore(0);
    setTotalPoints(0);
    setFeedback('NONE');
  };

  const handleAnswer = (idx: number, e: React.MouseEvent) => {
    if (feedback !== 'NONE') return;
    const isCorrect = idx === questions[currentIdx].correctAnswer;
    if (isCorrect) {
      setScore(s => s + 1);
      setTotalPoints(p => p + 10);
      setFeedback('CORRECT');
      setFeedbackMsg(PRAISE_MESSAGES[Math.floor(Math.random() * PRAISE_MESSAGES.length)]);
      playSound('correct');
      const newFloat = { id: Date.now(), x: e.clientX, y: e.clientY };
      setFloats(prev => [...prev, newFloat]);
      setTimeout(() => setFloats(prev => prev.filter(f => f.id !== newFloat.id)), 5000);
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

  const downloadCert = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200; canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const info = LEVEL_INFO[difficulty];
    ctx.fillStyle = '#fffdf0'; ctx.fillRect(0, 0, 1200, 800);
    ctx.strokeStyle = info.color; ctx.lineWidth = 20; ctx.strokeRect(40, 40, 1120, 720);
    if (userPhoto) {
      const img = new Image(); img.crossOrigin = "anonymous";
      img.onload = () => {
        ctx.save(); ctx.fillStyle = 'white'; ctx.fillRect(920, 80, 200, 260);
        ctx.strokeStyle = info.color; ctx.lineWidth = 4; ctx.strokeRect(920, 80, 200, 260);
        ctx.drawImage(img, 930, 90, 180, 240); ctx.restore();
        continueDrawing();
      };
      img.src = userPhoto;
    } else continueDrawing();

    function continueDrawing() {
      if (!ctx) return; ctx.textAlign = 'center'; ctx.fillStyle = '#8b4513';
      ctx.font = 'bold 70px "Playfair Display"'; ctx.fillText('GIẤY CHỨNG NHẬN', 600, 180);
      ctx.font = 'italic 30px "Quicksand"'; ctx.fillText(`Hoàn thành cấp độ: ${info.label}`, 600, 240);
      ctx.fillStyle = '#d32f2f'; ctx.font = 'bold 65px "Quicksand"'; ctx.fillText(userName.toUpperCase(), 600, 360);
      ctx.fillStyle = '#333'; ctx.font = 'bold 35px "Quicksand"'; ctx.fillText(`Lớp: ${userClass} | Hạng: ${info.rank}`, 600, 430);
      ctx.font = '30px "Quicksand"'; ctx.fillText('Đã chinh phục ôn tập Anh 6 Global Success HK1', 600, 520);
      ctx.font = 'bold 50px "Quicksand"'; ctx.fillStyle = info.color;
      ctx.fillText(`THÀNH TÍCH: ${score}/20 (${totalPoints} XP)`, 600, 620);
      ctx.textAlign = 'right'; ctx.font = '45px "Dancing Script"'; ctx.fillStyle = '#1a237e'; ctx.fillText('Thầy Đinh Văn Thành', 1100, 720);
      const link = document.createElement('a'); link.download = `Cert_${userName}.png`;
      link.href = canvas.toDataURL('image/png'); link.click();
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col items-center p-4 md:p-8 font-sans overflow-x-hidden">
      <audio ref={audioRef} />
      {floats.map(f => <FloatingPoint key={f.id} x={f.x} y={f.y} />)}

      {phase === 'REG' && (
        <div className="w-full max-w-lg mt-2 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="text-center">
            <h1 className="text-3xl font-black text-sky-600 mb-1 uppercase tracking-tight">Anh 6 Global Success 📝</h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Teacher Đinh Văn Thành</p>
          </div>
          <div className="bg-white p-6 rounded-[2rem] shadow-xl border-b-[8px] border-sky-100 space-y-6">
            <div className="space-y-4">
              <input type="text" placeholder="Họ tên học sinh" className="w-full px-5 py-4 bg-slate-50 rounded-xl font-bold border-2 border-transparent focus:border-sky-400 outline-none shadow-inner" value={userName} onChange={e => setUserName(e.target.value)} />
              <input type="text" placeholder="Lớp (Ví dụ: 6A1)" className="w-full px-5 py-4 bg-slate-50 rounded-xl font-bold border-2 border-transparent focus:border-sky-400 outline-none shadow-inner" value={userClass} onChange={e => setUserClass(e.target.value)} />
            </div>
            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Chọn mức độ</p>
              <div className="grid grid-cols-1 gap-2">
                {(Object.keys(LEVEL_INFO) as Difficulty[]).map(lvl => (
                  <button key={lvl} onClick={() => setDifficulty(lvl)} className={`p-4 rounded-xl border-2 flex items-center justify-between transition-all ${difficulty === lvl ? 'bg-sky-600 border-sky-700 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-sky-200'}`}>
                    <span className="font-black text-sm">{LEVEL_INFO[lvl].label}</span>
                    <span className="text-xl">{lvl === 'BASIC' ? '🥉' : lvl === 'INTERMEDIATE' ? '🥈' : '🥇'}</span>
                  </button>
                ))}
              </div>
            </div>
            <button disabled={!userName || !userClass} onClick={() => setPhase('PHOTO')} className="w-full bg-sky-600 text-white py-5 rounded-xl font-black text-lg shadow-[0_6px_0_rgb(2,132,199)] active:translate-y-1 active:shadow-none transition-all uppercase disabled:opacity-30">TIẾP TỤC 🚀</button>
          </div>
        </div>
      )}

      {phase === 'PHOTO' && (
        <div className="w-full max-w-md bg-white p-6 rounded-[2rem] shadow-xl mt-4 text-center animate-in zoom-in-95 duration-500">
          <h2 className="text-2xl font-black text-slate-800 mb-6 uppercase">Ảnh của em 🤳</h2>
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={e => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (ev) => setUserPhoto(ev.target?.result as string);
              reader.readAsDataURL(file);
            }
          }} />
          <div className="space-y-6">
            {!userPhoto ? (
              <button onClick={() => fileInputRef.current?.click()} className="w-full py-16 bg-sky-50 text-sky-600 rounded-[1.5rem] border-4 border-dashed border-sky-200 flex flex-col items-center gap-3">
                <span className="text-6xl">📸</span>
                <span className="font-black text-xs uppercase tracking-widest">Tải ảnh chân dung</span>
              </button>
            ) : (
              <div className="relative rounded-[2rem] overflow-hidden shadow-xl border-4 border-white aspect-[3/4] w-48 mx-auto">
                <img src={userPhoto} className="w-full h-full object-cover" alt="User" />
                <button onClick={() => setUserPhoto(null)} className="absolute top-2 right-2 bg-rose-500 text-white p-2 rounded-full text-xs font-bold shadow-lg">X</button>
              </div>
            )}
            <button onClick={startQuiz} className={`w-full py-5 rounded-xl font-black text-lg shadow-xl uppercase transition-all ${userPhoto ? 'bg-sky-600 text-white active:translate-y-1' : 'bg-slate-200 text-slate-400'}`}>BẮT ĐẦU ÔN TẬP 🏃</button>
          </div>
        </div>
      )}

      {phase === 'QUIZ' && (
        <div className="w-full max-w-2xl mt-2 space-y-4">
          <div className="flex justify-between items-center bg-white/90 p-4 rounded-2xl shadow-sm border border-white mx-2">
            <span className="font-black text-rose-600 text-lg">⏱️ {Math.floor(timeLeft/60)}:{timeLeft%60<10?'0':''}{timeLeft%60}</span>
            <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase">{LEVEL_INFO[difficulty].label}</span>
                <span className="font-black text-emerald-600 text-xl">{totalPoints} XP</span>
            </div>
          </div>
          <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border-b-8 border-sky-100 p-6 md:p-8 mx-2 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6">
              <span className="px-4 py-1 bg-sky-50 text-sky-600 rounded-full text-[10px] font-black uppercase tracking-widest">{questions[currentIdx]?.unit}</span>
              <span className="font-black text-slate-300 text-xs">Câu {currentIdx+1}/20</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-indigo-950 mb-10 leading-snug">{questions[currentIdx]?.question}</h3>
            <div className="grid grid-cols-1 gap-5">
              {questions[currentIdx]?.options.map((opt, i) => {
                const isCorrect = i === questions[currentIdx].correctAnswer;
                const config = [
                  { bg: 'bg-blue-500', shadow: 'shadow-[0_6px_0_rgb(29,78,216)]', active: 'active:shadow-none active:translate-y-1' },
                  { bg: 'bg-amber-500', shadow: 'shadow-[0_6px_0_rgb(180,83,9)]', active: 'active:shadow-none active:translate-y-1' },
                  { bg: 'bg-emerald-500', shadow: 'shadow-[0_6px_0_rgb(5,150,105)]', active: 'active:shadow-none active:translate-y-1' },
                  { bg: 'bg-rose-500', shadow: 'shadow-[0_6px_0_rgb(190,18,60)]', active: 'active:shadow-none active:translate-y-1' }
                ][i % 4];

                let btnClass = `w-full p-5 text-left rounded-2xl font-black text-white transition-all flex items-center gap-4 relative ${config.bg} ${config.shadow} ${config.active} `;
                if (feedback !== 'NONE') {
                  if (isCorrect) btnClass = `w-full p-5 text-left rounded-2xl font-black text-white bg-emerald-600 shadow-[0_4px_0_rgb(5,150,105)] translate-y-1 `;
                  else btnClass = `w-full p-5 text-left rounded-2xl font-black text-white bg-slate-400 opacity-50 `;
                }

                return (
                  <button key={i} onClick={(e) => handleAnswer(i, e)} disabled={feedback !== 'NONE'} className={btnClass}>
                    <span className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-lg">{String.fromCharCode(65+i)}</span>
                    <span className="text-sm md:text-lg break-words flex-1 leading-tight">{opt}</span>
                  </button>
                );
              })}
            </div>
            {feedback !== 'NONE' && (
              <div className={`mt-8 p-5 rounded-2xl animate-in zoom-in-95 border-2 ${feedback === 'CORRECT' ? 'bg-emerald-50 border-emerald-200 shadow-emerald-50' : 'bg-rose-50 border-rose-200 shadow-rose-50'} shadow-lg`}>
                <p className="font-black text-slate-800 text-lg mb-2">{feedbackMsg}</p>
                <div className="flex gap-3 items-start">
                    <span className="text-xl">💡</span>
                    <p className="text-xs font-medium text-slate-600 leading-relaxed italic">{questions[currentIdx]?.explanation}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {phase === 'CERT' && (
        <div className="w-full max-w-md flex flex-col items-center animate-in fade-in duration-700 px-4 mt-2">
          <div className="bg-[#fffdf0] rounded-3xl border-[16px] p-8 shadow-2xl relative overflow-hidden" style={{borderColor: LEVEL_INFO[difficulty].color}}>
            <h1 className="text-center text-2xl font-bold text-[#8b4513] cert-font uppercase mb-6 tracking-widest">Giấy Chứng Nhận</h1>
            <div className="flex flex-col gap-6 items-center mb-8">
              <div className="text-center">
                <h2 className="text-3xl font-black text-rose-700 mb-2 uppercase tracking-tight">{userName}</h2>
                <p className="text-sm font-bold text-slate-700">Lớp: {userClass}</p>
                <div className="mt-6 bg-white/80 px-8 py-4 rounded-3xl border-2 border-slate-100 shadow-xl inline-block">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Thành tích</p>
                  <p className="text-4xl font-black text-emerald-600">{totalPoints} XP</p>
                </div>
              </div>
              {userPhoto && <img src={userPhoto} className="w-24 aspect-[3/4] object-cover rounded-xl shadow-2xl border-4 border-white transform rotate-2" alt="Cert" />}
            </div>
            <div className="text-right mt-4 border-t-2 border-slate-100 pt-4">
              <p className="sig-font text-4xl text-indigo-900 opacity-90 -rotate-2">Đinh Văn Thành</p>
            </div>
          </div>
          <div className="w-full mt-10 space-y-4">
            <button onClick={downloadCert} className="w-full bg-emerald-600 text-white py-6 rounded-2xl font-black text-xl shadow-xl hover:bg-emerald-700 active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest">Lưu ảnh 💾</button>
            <button onClick={startQuiz} className="w-full bg-sky-600 text-white py-6 rounded-2xl font-black text-xl shadow-xl hover:bg-sky-700 active:translate-y-1 active:shadow-none transition-all flex flex-col items-center uppercase">
                <span className="text-[10px] opacity-80 mb-1">Làm mới 10 câu hỏi</span>
                LUYỆN TẬP TIẾP ⚔️
            </button>
            <button onClick={() => window.location.reload()} className="w-full bg-white border-2 border-slate-200 text-slate-400 py-4 rounded-2xl font-black text-sm active:translate-y-1 transition-all uppercase tracking-widest">Về trang chủ 🔄</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
