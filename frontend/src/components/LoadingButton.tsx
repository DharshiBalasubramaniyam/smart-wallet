import React from 'react';

function LoadingButton({ text }: { text: string }) {
   return (
      <button
         className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded text-text-dark-primary bg-secondary hover:bg-primary cursor-not-allowed opacity-50"
         disabled
      >
         <span
            style={{
               marginRight: '10px',
               border: '2px solid #fff',
               borderTop: '2px solid transparent',
               borderRadius: '50%',
               width: '16px',
               height: '16px',
               animation: 'spin 1s linear infinite',
            }}
         />
         {text}
      </button>
   );
}

export default LoadingButton;