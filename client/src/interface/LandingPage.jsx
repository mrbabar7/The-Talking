import React, { useState } from "react";
import ThirdColumn from "../components/ThirdColumn";
import Modal from "../partials/Modal";
import Logout from "../components/Logout";
import FirstColumn from "../components/FirstColumn";
import SecondColumn from "../components/SecondColumn";
import ProfileProvider from "../provider/profileProvider";
import ChatProvider from "../provider/ChatProvider";
const LandingPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <ChatProvider>
      <ProfileProvider>
        <div className="h-screen bg-blue-100">
          <div className="h-full flex flex-col   md:grid md:grid-cols-12">
            <FirstColumn setModalOpen={setModalOpen}></FirstColumn>
            <SecondColumn></SecondColumn>

            <ThirdColumn></ThirdColumn>
          </div>
          {modalOpen && (
            <Modal
              onClose={() => {
                setModalOpen(false);
              }}
            >
              <Logout setModalOpen={setModalOpen}></Logout>
            </Modal>
          )}
        </div>
      </ProfileProvider>
    </ChatProvider>
  );
};

export default LandingPage;
