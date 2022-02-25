import React, { useEffect } from "react";
import { Badge } from "react-bootstrap";
import { Announcement, Student } from "../../App";
import db from "../../firebase";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";

interface AnnouncementsProps {
    student: Student | undefined;
  }
  
  interface AnnouncementNodeProps {
    announcement: Announcement;
    student: Student | undefined;
  }
  

const Announcements: React.FC<AnnouncementsProps> = ({student }) => {
    useEffect(() => {
    });
    return (
      <div className="projects-list glass">
        <h2 className="text-2xl font-bold">Announcements</h2>
        {student?.announcements.map((announcement: Announcement, index: number) => (
          <AnnouncementNode announcement={announcement} student={student} key={index} />
        ))}
      </div>
    );
  };
  
  const AnnouncementNode: React.FC<AnnouncementNodeProps> = ({
    announcement,
    student
  }) => {
    async function deleteAnnouncementNode() {
      console.log("delete Announcement");
      //Delete from student?.announcements
      if (student) {
        await updateDoc(doc(db, "users", student?.docId), {
          announcements: arrayRemove({
            title: announcement.title,
            content: announcement.content,
            author: announcement.author
          })
        }).then(() => {
          // setAnnouncements(announcements.filter((el) => el.randId !== announcement.randId));
        });
      } else {
        console.log("can't find student");
      }
    };
  
    return (
      <div className="dashboard-glass announcement">
        <div className="announcement-top-heading">
          <Badge pill className="primary-badge">
            {announcement.author}
          </Badge>
          <button className="close-toast" onClick={deleteAnnouncementNode}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="announcement-body">
          <h4 className="title">{announcement.title}</h4>
          <h6>{announcement.content}</h6>
        </div>
      </div>
    );
  };

  export default Announcements;
  