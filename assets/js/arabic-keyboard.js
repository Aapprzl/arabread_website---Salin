/**
 * ARABIC KEYBOARD UI INJECTOR
 * Refactored: Single Harakat Row, Combining Hamzah Logic, Responsive Grid
 */

function getArabicKeyboardHTML() {
  return `
    <div id="arabic-keyboard" class="hidden"
      style="position: fixed; bottom: 0; left: 0; width: 100%; z-index: 50; pointer-events: none;">
      
      <style>
        #keyboard-container { 
            pointer-events: auto; 
            background: #cbd5e1; /* Slate-300 Base */
            box-shadow: 0 -4px 10px rgba(0,0,0,0.1); 
            border-top: 1px solid #94a3b8;
            
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            z-index: 10000;
            padding: 6px 4px 20px 4px; /* Extra bottom padding for safe area */
            display: flex;
            flex-direction: column;
            gap: 6px;
            
            border-top-left-radius: 12px;
            border-top-right-radius: 12px;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
        }

        .dark #keyboard-container {
            background: #1e293b; 
            border-top-color: #334155;
        }

        /* Desktop: Floating & Side-by-Side (Keep sidebar logic if needed, but style updates) */
        @media (min-width: 768px) {
            #keyboard-container {
                flex-direction: row; 
                align-items: stretch;
                width: auto;
                min-width: 680px;
                max-width: 90vw;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%);
                padding: 15px;
                border-radius: 20px;
                box-shadow: 0 20px 50px rgba(0,0,0,0.3);
                gap: 15px;
                background: #e2e8f0;
            }
            .dark #keyboard-container { background: #0f172a; }
        }
        
        .keyboard-header-mobile {
            display: flex;
            justify-content: flex-end; /* Close button right */
            width: 100%;
            padding-right: 8px;
            margin-bottom: -4px;
        }
        @media (min-width: 768px) { .keyboard-header-mobile { display: none; } }

        .keyboard-wrapper { flex: 1; display: flex; flex-direction: column; gap: 5px; }
        .keyboard-row { display: flex; justify-content: center; gap: 4px; }
        
        /* KEYS STYLING (Flat & Compact) */
        .key-arab, .key-harakat, .key-control { 
            flex: 1; 
            padding: 0;
            height: 42px; 
            display: flex; align-items: center; justify-content: center;
            border-radius: 6px; 
            border: none;
            background: #fff; 
            font-size: 1.25rem; 
            font-family: 'Amiri', serif; 
            color: #1e293b;
            box-shadow: 0 2px 0 #94a3b8; 
            cursor: pointer; 
            user-select: none;
            position: relative;
            min-width: 0;
            -webkit-tap-highlight-color: transparent;
        }

        /* Active State */
        .key-arab:active, .key-harakat:active, .key-control:active {
             transform: translateY(2px); 
             box-shadow: none !important;
             background: #f1f5f9;
        }

        /* Dark Mode Keys */
        .dark .key-arab {
            background: #334155;
            color: #f8fafc;
            box-shadow: 0 2px 0 #0f172a;
        }

        /* Harakat Keys (Cream/Orange Tint) */
        .key-harakat { 
            background: #ffedd5; /* Orange-50 */
            color: #c2410c; 
            box-shadow: 0 2px 0 #fb923c;
        }
        .dark .key-harakat { background: #431407; color: #fb923c; box-shadow: 0 2px 0 #7c2d12; }

        /* Control Keys (Enter = Teal, Backspace = Grey) */
        .key-control { font-family: sans-serif; font-size: 0.9rem; font-weight: bold; }
        
        /* Enter Key (Teal) */
        .key-enter {
            background: #0d9488 !important; /* Teal-600 */
            color: #fff !important;
            box-shadow: 0 2px 0 #0f766e !important;
        }
        .key-enter:active { background: #115e59 !important; }
        
        /* Backspace/Space (Slate) */
        .key-backspace, .key-space {
            background: #94a3b8 !important;
            color: #fff !important;
            box-shadow: 0 2px 0 #64748b !important;
        }

        /* Mobile Specific Overrides */
        @media (max-width: 480px) {
            #keyboard-container { padding: 6px 4px 24px 4px; gap: 5px; } /* Compact padding */
            .keyboard-row { gap: 3px; }
            
            .key-arab, .key-harakat, .key-control {
                height: 38px !important; /* Tighter height */
                font-size: 1.2rem !important;
                border-radius: 5px !important;
            }
            .key-enter, .key-backspace, .key-space {
                 font-size: 0.8rem;
            }
        }

        /* Close Button Sidebar */
        .btn-close-sidebar {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            background: #e2e8f0;
            color: #64748b;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            box-shadow: 0 4px 0 #cbd5e1;
        }
        .btn-close-sidebar:hover { background: #fecaca; color: #ef4444; box-shadow: 0 4px 0 #fca5a5; }
        .btn-close-sidebar:active { transform: translateY(4px); box-shadow: none; margin-top: 4px; }
        
        .dark .btn-close-sidebar { background: #334155; color: #94a3b8; box-shadow: 0 4px 0 #1e293b; }
        .dark .btn-close-sidebar:hover { background: #7f1d1d; color: #fca5a5; box-shadow: 0 4px 0 #450a0a; }

        /* Label Sidebar */
        .label-sidebar {
            writing-mode: vertical-rl;
            text-orientation: mixed;
            transform: rotate(180deg);
            margin-top: 15px;
            font-size: 10px;
            font-weight: 900;
            letter-spacing: 2px;
            color: #94a3b8;
            text-transform: uppercase;
        }
      </style>

      <div id="keyboard-container">
        
        <!-- MOBILE HEADER (Visible only on mobile) -->
        <div class="keyboard-header-mobile">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Arabic Keyboard</span>
            <button class="p-2 bg-slate-200 dark:bg-slate-700 rounded-lg text-slate-500" onclick="document.getElementById('arabic-keyboard').classList.add('hidden')">✕</button>
        </div>

        <!-- SIDEBAR (Desktop Only) -->
        <div class="keyboard-sidebar hidden md:flex">
             <button class="btn-close-sidebar" onclick="document.getElementById('arabic-keyboard').classList.add('hidden')" title="Close">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
             </button>
             <span class="label-sidebar">ARABIC KEYBOARD</span>
        </div>

        <!-- MAIN KEYS -->
        <div class="keyboard-wrapper">
          
          <!-- ROW 1 -->
          <div class="keyboard-row">
            <button class="key-harakat" data-char="َ">َ</button>
            <button class="key-harakat" data-char="ِ">ِ</button>
            <button class="key-harakat" data-char="ُ">ُ</button>
            <button class="key-harakat" data-char="ّ">ّ</button>
            <button class="key-harakat" data-char="ْ">ْ</button>
            <button class="key-harakat" data-char="ٔ">ٔ</button>
            <button class="key-harakat" data-char="ٕ">ٕ</button>
            <button class="key-harakat" data-char="ٓ">ٓ</button>
            <button class="key-harakat" data-char="ً">ً</button>
            <button class="key-harakat" data-char="ٍ">ٍ</button>
            <button class="key-harakat" data-char="ٌ">ٌ</button>
          </div>
          
          <!-- ROW 2 -->
          <div class="keyboard-row">
            <button class="key-arab" data-char="ض">ض</button>
            <button class="key-arab" data-char="ص">ص</button>
            <button class="key-arab" data-char="ث">ث</button>
            <button class="key-arab" data-char="ق">ق</button>
            <button class="key-arab" data-char="ف">ف</button>
            <button class="key-arab" data-char="غ">غ</button>
            <button class="key-arab" data-char="ع">ع</button>
            <button class="key-arab" data-char="ه">ه</button>
            <button class="key-arab" data-char="خ">خ</button>
            <button class="key-arab" data-char="ح">ح</button>
            <button class="key-arab" data-char="ج">ج</button>
            <button class="key-arab" data-char="ء">ء</button>
          </div>

          <!-- ROW 3 -->
          <div class="keyboard-row">
            <button class="key-arab" data-char="ش">ش</button>
            <button class="key-arab" data-char="س">س</button>
            <button class="key-arab" data-char="ي">ي</button>
            <button class="key-arab" data-char="ب">ب</button>
            <button class="key-arab" data-char="ل">ل</button>
            <button class="key-arab" data-char="ا">ا</button>
            <button class="key-arab" data-char="ت">ت</button>
            <button class="key-arab" data-char="ن">ن</button>
            <button class="key-arab" data-char="م">م</button>
            <button class="key-arab" data-char="ك">ك</button>
            <button class="key-arab" data-char="ؤ">ؤ</button>
          </div>

          <!-- ROW 4 -->
          <div class="keyboard-row">
            <button class="key-arab" data-char="ئ">ئ</button>
            <button class="key-arab" data-char="ط">ط</button>
            <button class="key-arab" data-char="ظ">ظ</button>
            <button class="key-arab" data-char="ر">ر</button>
            <button class="key-arab" data-char="لا">لا</button>
            <button class="key-arab" data-char="ى">ى</button>
            <button class="key-arab" data-char="ة">ة</button>
            <button class="key-arab" data-char="و">و</button>
            <button class="key-arab" data-char="ز">ز</button>
            <button class="key-arab" data-char="د">د</button>
            <button class="key-arab" data-char="ذ">ذ</button>
          </div>

          <!-- ROW 5 -->
          <div class="keyboard-row">
            <button id="key-space" class="key-control key-space" data-char=" ">Spasi</button>
            <button id="key-backspace" class="key-control backspace">⌫</button>
            <button id="key-enter" class="key-control bg-blue-600 text-white shadow-blue-600/50 hover:bg-blue-700">↵</button>
          </div>

        </div>
      </div>
    </div>
  `;
}

function injectArabicKeyboard() {
  if (document.getElementById('arabic-keyboard')) return; // Prevent duplicate
  document.body.insertAdjacentHTML('beforeend', getArabicKeyboardHTML());
}

// Auto-inject when loaded
document.addEventListener("DOMContentLoaded", injectArabicKeyboard);
