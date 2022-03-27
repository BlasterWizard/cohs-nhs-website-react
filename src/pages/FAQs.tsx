import React from "react";

export interface FAQNode {
  title: string;
  content: string;
  link?: LinkNode;
  docId?: string;
}

interface LinkNode {
  title: string;
  url: string;
}

interface FAQsProps {
  faqs: FAQNode[];
}

const FAQs: React.FC<FAQsProps> = ({ faqs }) => {
  return (
    <main>
      <div className="space-y-5 flex flex-col items-center">
        <h2 className="text-4xl font-bold text-center">FAQs</h2>
        {/* Contacts */}

        <div className="flex flex-col items-center bg-white/60 p-3 rounded-2xl">
          <p className="font-bold text-xl">NHS Class of 2022 Google Classroom</p>
          <p><span className="font-bold">Code:</span>bh3walj</p>
          <a className="block bg-emerald-400 hover:bg-emerald-500 hover:scale-120 p-2 rounded-full m-2 text-white font-bold w-fit" href="https://classroom.google.com/c/MjA1NTU2NzM0MzYy?cjc=bh3walj">
          Invite Link
          </a>
        </div>

        <div className="flex flex-col items-center bg-white/60 py-3 px-4 rounded-2xl">
          <p className="font-bold text-xl">Band Mobile App</p>
          <p>Please contact Ashton if you are not yet in the Band!</p>
        </div>     

        {
          faqs.map((faq: FAQNode, index: number) => {
            return <FAQ title={faq.title} content={faq.content} link={faq.link} key={index} />
          })
        }   
      </div>
    </main>
  );
};

const FAQ: React.FC<FAQNode> = ({ title, content, link }) => {
  return (
    <div className="bg-white/60 p-2 rounded-lg text-center w-3/4 space-y-3 flex flex-col items-center">
      <h5>
        <strong>{title}</strong>
      </h5>
      <h6>{content}</h6>
      {link && (
        <a className="block bg-indigo-300 hover:bg-indigo-400 hover:scale-120 p-2 rounded-full m-2 text-white font-bold w-fit" href={link.url}>
          {link.title}
        </a>
      )}
    </div>
  );
};

export default FAQs;
