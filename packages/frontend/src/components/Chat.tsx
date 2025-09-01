// // // packages/frontend/src/components/Chat.tsx
// // 'use client'; // This is a client component, as it uses state and interactivity

// // import { useState } from 'react';
// // import { Send } from 'lucide-react';

// // // Define the structure of a chat message
// // interface Message {
// //   role: 'user' | 'assistant';
// //   content: string;
// // }

// // export function Chat() {
// //   // State for the uploaded PDF file name
// //   const [documentName, setDocumentName] = useState<string | null>(null);
// //   // State to hold the chat history
// //   const [messages, setMessages] = useState<Message[]>([]);
// //   // State for the user's current input
// //   const [input, setInput] = useState<string>('');
// //   // Loading states
// //   const [isUploading, setIsUploading] = useState<boolean>(false);
// //   const [isReplying, setIsReplying] = useState<boolean>(false);

// //   const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
// //   const file = event.target.files?.[0];
// //   if (!file) return;

// //   setIsUploading(true);
// //   setMessages([]); // Clear previous chat
// //   setDocumentName(null);

// //   const formData = new FormData();
// //   formData.append('pdf', file);

// //   try {
// //     const response = await fetch('http://localhost:8000/api/upload', {
// //       method: 'POST',
// //       body: formData,
// //     });

// //     if (!response.ok) {
// //       throw new Error('File upload failed');
// //     }

// //     setDocumentName(file.name);
// //     // Add a welcome message from the assistant
// //     setMessages([{ role: 'assistant', content: `Successfully uploaded "${file.name}". You can now ask questions about it.` }]);
// //   } catch (error) {
// //     console.error(error);
// //     alert('There was an error uploading the file. Please try again.');
// //     setMessages([{ role: 'assistant', content: `Sorry, I failed to upload the document. Please try again.` }]);
// //   } finally {
// //     setIsUploading(false);
// //   }
// //   };

// //   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
// //   event.preventDefault();
// //   if (!input.trim() || !documentName) return;

// //   // Add user's message to the chat history
// //   const userMessage: Message = { role: 'user', content: input };
// //   setMessages(prev => [...prev, userMessage]);
// //   setInput(''); // Clear the input field
// //   setIsReplying(true);

// //   try {
// //     const response = await fetch('http://localhost:8000/api/chat', {
// //       method: 'POST',
// //       headers: {
// //         'Content-Type': 'application/json',
// //       },
// //       body: JSON.stringify({
// //         question: input,
// //         documentName: documentName,
// //       }),
// //     });

// //     if (!response.ok) {
// //       throw new Error('Chat API request failed');
// //     }

// //     const result = await response.json();

// //     // Add assistant's response to the chat history
// //     const assistantMessage: Message = { role: 'assistant', content: result.answer };
// //     setMessages(prev => [...prev, assistantMessage]);

// //   } catch (error) {
// //     console.error(error);
// //     const errorMessage: Message = { role: 'assistant', content: "Sorry, I ran into an error. Please try again." };
// //     setMessages(prev => [...prev, errorMessage]);
// //   } finally {
// //     setIsReplying(false);
// //   }
// //     };
// //   return (
// //     <div className="w-full max-w-4xl h-[70vh] bg-gray-800 rounded-lg shadow-lg flex flex-col">
// //       {/* Header */}
// //       <div className="bg-gray-700 p-4 rounded-t-lg">
// //         <h2 className="text-xl font-semibold">
// //           {documentName ? `Chat with ${documentName}` : "Upload a PDF to start"}
// //         </h2>
// //       </div>

// //       {/* Chat Messages */}
// //       <div className="flex-1 p-4 overflow-y-auto">
// //         {messages.length === 0 && !documentName && (
// //           <div className="flex justify-center items-center h-full">
// //             <div className="text-center p-4 border-2 border-dashed border-gray-600 rounded-lg">
// //                 <p className="text-gray-400">Upload a PDF to begin the conversation.</p>
// //                 <input type="file" id="pdf-upload" accept=".pdf" onChange={handleUpload} className="hidden" disabled={isUploading} />
// //                 <label htmlFor="pdf-upload" className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
// //                     {isUploading ? 'Uploading...' : 'Upload PDF'}
// //                 </label>
// //             </div>
// //           </div>
// //         )}
// //         <div className="space-y-4">
// //             {messages.map((msg, index) => (
// //             <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
// //                 <div className={`max-w-xs md:max-w-md lg:max-w-2xl p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-600'}`}>
// //                 <p className="text-white">{msg.content}</p>
// //                 </div>
// //             </div>
// //             ))}
// //             {isReplying && (
// //                 <div className="flex justify-start">
// //                     <div className="bg-gray-600 p-3 rounded-lg">
// //                         <p className="text-white">Thinking...</p>
// //                     </div>
// //                 </div>
// //             )}
// //         </div>
// //         {/* We will map over messages here later */}
// //       </div>

// //       {/* Chat Input Form */}
// //       <div className="p-4 border-t border-gray-700">
// //         <form onSubmit={handleSubmit} className="flex items-center">
// //           <input
// //             type="text"
// //             value={input}
// //             onChange={(e) => setInput(e.target.value)}
// //             placeholder={documentName ? "Ask a question about the PDF..." : "Upload a PDF first"}
// //             className="flex-1 p-2 rounded-lg bg-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             disabled={!documentName || isReplying}
// //           />
// //           <button
// //             type="submit"
// //             className="ml-4 p-2 bg-blue-600 rounded-full hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
// //             disabled={!documentName || isReplying || !input}
// //           >
// //             <Send className="h-6 w-6" />
// //           </button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }


// 'use client'; // This component uses state and browser APIs, so it must be a client component.

// import { useState, useRef, useEffect, FormEvent, ChangeEvent } from 'react';
// import { Send, Loader2, FileUp } from 'lucide-react'; // Using lucide-react for icons
// import { clsx } from 'clsx'; // Utility for conditional class names
// import { twMerge } from 'tailwind-merge'; // Utility to merge Tailwind classes

// // Helper function to combine clsx and twMerge for cleaner conditional classes
// function cn(...inputs: any[]) {
//   return twMerge(clsx(inputs));
// }

// // Define the structure of a chat message for type safety
// interface Message {
//   role: 'user' | 'assistant';
//   content: string;
// }

// export function Chat() {
//   // State management for all component logic
//   const [documentName, setDocumentName] = useState<string | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState<string>('');
//   const [isUploading, setIsUploading] = useState<boolean>(false);
//   const [isReplying, setIsReplying] = useState<boolean>(false);

//   // Ref for the message container to enable auto-scrolling
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // Effect to scroll to the bottom of the chat whenever a new message is added
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   /**
//    * Handles the PDF file upload process.
//    */
//   const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     // Reset state for a new chat session
//     setIsUploading(true);
//     setMessages([]);
//     setDocumentName(null);

//     const formData = new FormData();
//     formData.append('pdf', file);

//     try {
//       const response = await fetch('http://localhost:8000/api/upload', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         // Try to get a more specific error message from the backend if available
//         const errorData = await response.json().catch(() => ({ error: 'File upload failed with no specific message.' }));
//         throw new Error(errorData.error || 'File upload failed');
//       }

//       setDocumentName(file.name);
//       // Add a welcome message from the assistant to start the conversation
//       setMessages([{
//         role: 'assistant',
//         content: `Successfully uploaded "${file.name}". You can now ask questions about it.`
//       }]);
//     } catch (error: any) {
//       console.error(error);
//       setMessages([{
//         role: 'assistant',
//         content: `Sorry, I ran into an error uploading the file: ${error.message}. Please try again.`
//       }]);
//     } finally {
//       setIsUploading(false);
//       // Clear the file input value so the same file can be uploaded again if the user changes their mind
//       event.target.value = '';
//     }
//   };

//   /**
//    * Handles the chat form submission.
//    */
//   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     if (!input.trim() || !documentName) return;

//     // Add user's message to the chat history for an immediate UI update
//     const userMessage: Message = { role: 'user', content: input };
//     setMessages(prev => [...prev, userMessage]);
//     const currentInput = input;
//     setInput(''); // Clear the input field right away
//     setIsReplying(true);

//     try {
//       const response = await fetch('http://localhost:8000/api/chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           question: currentInput,
//           documentName: documentName,
//           chat_history: messages, // Send the entire conversation history
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({ error: 'API request failed.' }));
//         throw new Error(errorData.error || 'Chat API request failed');
//       }

//       const result = await response.json();

//       // Add assistant's response to the chat history
//       const assistantMessage: Message = { role: 'assistant', content: result.answer };
//       setMessages(prev => [...prev, assistantMessage]);

//     } catch (error: any) {
//       console.error(error);
//       const errorMessage: Message = { role: 'assistant', content: `Sorry, I ran into an error: ${error.message}. Please try again.` };
//       setMessages(prev => [...prev, errorMessage]);
//     } finally {
//       setIsReplying(false);
//     }
//   };

//   // The component's JSX structure
//   return (
//     <div className="w-full max-w-4xl h-[85vh] bg-gray-800 rounded-lg shadow-2xl flex flex-col border border-gray-700">
//       {/* Header Section */}
//       <div className="bg-gray-700 p-4 rounded-t-lg flex items-center justify-between border-b border-gray-600">
//         <h2 className="text-xl font-semibold truncate" title={documentName || "No document uploaded"}>
//           {documentName ? `Chat with ${documentName}` : "Upload a PDF to Start"}
//         </h2>
//       </div>

//       {/* Chat Messages Area */}
//       <div className="flex-1 p-4 overflow-y-auto space-y-4">
//         {messages.length === 0 && !documentName && (
//           <div className="flex justify-center items-center h-full">
//             <div className="text-center p-8 border-2 border-dashed border-gray-600 rounded-lg">
//                 <FileUp className="mx-auto h-12 w-12 text-gray-500" />
//                 <p className="mt-4 text-gray-400">Upload a PDF to begin the conversation.</p>
//                 <input type="file" id="pdf-upload" accept=".pdf" onChange={handleUpload} className="hidden" disabled={isUploading} />
//                 <label
//                     htmlFor="pdf-upload"
//                     className={cn(
//                         "mt-4 inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer transition-colors",
//                         isUploading && "bg-blue-800 cursor-not-allowed"
//                     )}
//                 >
//                     {isUploading ? (
//                         <>
//                             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                             Uploading...
//                         </>
//                     ) : (
//                         'Upload PDF'
//                     )}
//                 </label>
//             </div>
//           </div>
//         )}

//         {messages.map((msg, index) => (
//           <div key={index} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
//             <div className={cn(
//                 'max-w-xs md:max-w-md lg:max-w-2xl p-3 rounded-lg shadow whitespace-pre-wrap', // `whitespace-pre-wrap` preserves formatting
//                  msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'
//             )}>
//               <p>{msg.content}</p>
//             </div>
//           </div>
//         ))}

//         {isReplying && (
//             <div className="flex justify-start">
//             <div className="bg-gray-600 p-3 rounded-lg shadow flex items-center space-x-2">
//                 {/* A simple "thinking" animation */}
//                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
//                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
//                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
//             </div>
//             </div>
//         )}

//         {/* Empty div to act as a permanent scroll target at the bottom */}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Chat Input Form */}
//       <div className="p-4 border-t border-gray-700">
//         <form onSubmit={handleSubmit} className="flex items-center space-x-4">
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder={documentName ? "Ask a question about the PDF..." : "Please upload a PDF first"}
//             className="flex-1 p-2 rounded-lg bg-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
//             disabled={!documentName || isReplying || isUploading}
//           />
//           <button
//             type="submit"
//             className="p-2 bg-blue-600 rounded-full hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
//             disabled={!documentName || isReplying || !input.trim() || isUploading}
//             aria-label="Send message"
//           >
//             <Send className="h-6 w-6" />
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, UploadCloud } from 'lucide-react';
import styles from './Chat.module.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function Chat() {
  const [documentName, setDocumentName] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isReplying, setIsReplying] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isReplying]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setMessages([]);
    setDocumentName(null);

    try {
      // FAKE UPLOAD FOR DEMO
      await new Promise(res => setTimeout(res, 1500));
      setDocumentName(file.name);
      setMessages([{ role: 'assistant', content: `Successfully ingested "${file.name}". I am now ready to answer your questions.` }]);
    } catch (error) {
      console.error(error);
      setMessages([{ role: 'assistant', content: `Sorry, there was an error processing the document.` }]);
    } finally {
      setIsUploading(false);
    }
  };

  // inside the Chat component in Chat.tsx
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  if (!input.trim() || !documentName) return;

  // Add user's message to the chat history
  const userMessage: Message = { role: 'user', content: input };
  setMessages(prev => [...prev, userMessage]);
  setInput(''); // Clear the input field
  setIsReplying(true);

  try {
    const response = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: input,
        documentName: documentName,
      }),
    });

    if (!response.ok) {
      throw new Error('Chat API request failed');
    }

    const result = await response.json();

    // Add assistant's response to the chat history
    const assistantMessage: Message = { role: 'assistant', content: result.answer };
    setMessages(prev => [...prev, assistantMessage]);

  } catch (error) {
    console.error(error);
    const errorMessage: Message = { role: 'assistant', content: "Sorry, I ran into an error. Please try again." };
    setMessages(prev => [...prev, errorMessage]);
  } finally {
    setIsReplying(false);
  }
};

  return (
    <div className={styles.chatContainer}>
      <header className={styles.header}>
        <h2>{documentName ? `Querying: ${documentName}` : "Awaiting Document Upload"}</h2>
      </header>

      <main className={styles.messagesContainer}>
        {messages.length === 0 && !documentName && (
          <div className={styles.uploadArea}>
            <input
              type="file"
              id="pdf-upload"
              accept=".pdf"
              onChange={handleUpload}
              className={styles.hiddenFileInput} // This class makes the ugly input disappear
              disabled={isUploading}
            />
            {/* This label is now the entire clickable area */}
            <label htmlFor="pdf-upload" className={styles.uploadBox}>
              <UploadCloud size={48} style={{ marginBottom: '1rem', color: '#8a2be2' }} />
              <p>Drop a PDF here or click to select a file</p>
              <span className={styles.uploadButton}>
                {isUploading ? 'Processing...' : 'Select PDF'}
              </span>
            </label>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={msg.role === 'user' ? styles.userMessageWrapper : styles.assistantMessageWrapper}>
            <div className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.assistantMessage}`}>
              <p>{msg.content}</p>
            </div>
          </div>
        ))}

        {isReplying && (
          <div className={styles.assistantMessageWrapper}>
            <div className={styles.thinkingBubble}>
              <p>Thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className={styles.form}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={documentName ? "Ask a question about the document..." : "Upload a document to begin"}
            className={styles.input}
            disabled={!documentName || isReplying}
          />
          <button
            type="submit"
            className={styles.sendButton}
            disabled={!documentName || isReplying || !input.trim()}
          >
            <Send />
          </button>
        </form>
      </footer>
    </div>
  );
}