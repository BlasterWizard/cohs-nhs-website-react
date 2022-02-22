import React from "react";

interface FAQNode {
  title: string;
  content: string;
  link?: LinkNode;
}

interface LinkNode {
  title: string;
  link: string;
}

const FAQs = () => {
  return (
    <main>
      <div className="space-y-5 flex flex-col items-center">
        <h2 className="text-4xl font-bold text-center">FAQs</h2>
        {/* Contacts */}

        <FAQ
          title={"NHS Class of 2022 Google Classroom"}
          content={"Code: bh3walj"}
          link={{
            title: "Invite Link",
            link: "https://classroom.google.com/c/MjA1NTU2NzM0MzYy?cjc=bh3walj",
          }}
        />

        <FAQ
          title={"Band Mobile App"}
          content={"Please contact Ashton if you are not yet in the Band!"}
        />

        {/* FAQs */}
        <FAQ
          title={"Can service hours be from non-affiliated NHS projects?"}
          content={"Yes! :DD"}
        />

        <FAQ
          title={"Can I assign hours for my club’s volunteer projects?"}
          content={
            "You must consult with the board before setting your club’s volunteer hours"
          }
        />

        <FAQ
          title={"When and where should I submit my hours?"}
          content={
            "Please submit your hours throughout the year as you complete them through this link:"
          }
          link={{
            title: "Hours Submission Form",
            link: "https://docs.google.com/forms/d/e/1FAIpQLScF6mnnhG7RBQ-7wqClG2CoqWMAcXgEaGcCt8bRyWxI2BZrjA/viewform/",
          }}
        />

        <FAQ
          title={"Who do I contact about service hours/projects?"}
          content={"Lauren :DD"}
        />

        <FAQ
          title={"Should I worry about completing my NHS project this year?"}
          content={"Nope! No need to worry!"}
        />

        <FAQ
          title={
            "What is the difference between an NHS project and a service project?"
          }
          content={
            "A service project is a project done in order to get the required service hours completed while an NHS project is a project that you plan and lead others in."
          }
        />

        <FAQ
          title={"When are opportunity meetings?"}
          content={
            "Opportunity meetings are every third Mondays of the month, but they are subject to change! These meetings are an easy way for you to get your hours in!"
          }
        />

        <FAQ
          title={"Can I “double dip” my NHS and CSF hours?"}
          content={
            "Nope! But CSF tutoring hours can count for both NHS and CSF "
          }
        />

        <FAQ
          title={"Can I assign hours for my club’s volunteer projects?"}
          content={
            "You must consult with the board before setting your club’s volunteer hours"
          }
        />

        <FAQ
          title={"If I have a question that isn’t answered here who do I ask?"}
          content={
            "Please contact the officer board and NOT Mrs. Lew!"
          }
        />
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
        <a className="block bg-indigo-300 hover:bg-indigo-400 hover:scale-120 p-2 rounded-full m-2 text-white font-bold w-fit" href={link.link}>
          {link.title}
        </a>
      )}
    </div>
  );
};

export default FAQs;
