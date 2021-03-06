import  React from 'react';
import { toast, Toaster, ToastBar } from 'react-hot-toast';

const ToasterNode = () => {
    return (
      <Toaster
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        }}
      >
        {(t: any) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <>
                {icon}
                {message}
                {
                  <button
                    className="bg-white/60 py-0.5 px-2 rounded-full"
                    onClick={() => toast.dismiss(t.id)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                }
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
    );
  };

  export default ToasterNode;
  