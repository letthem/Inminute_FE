import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FolderItem from "./FolderItem";
import folderIcon from "./../assets/folder.svg";
import plus from "./../assets/plus.svg";
import minus from "./../assets/minus.svg";
import { useAppContext } from "./../context/AppContext";

interface FolderProps {
  onSelectFolder: (folderId: number | null) => void;
}

const Folder: React.FC<FolderProps> = ({ onSelectFolder }) => {
  const { folders, notes, addFolder, fetchNote } = useAppContext();
  const [newFolder, setNewFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const nav = useNavigate();

  useEffect(() => {
    if (newFolder && inputRef.current) {
      inputRef.current.focus();
    }
  }, [newFolder]);

  const handleNewFolderClick = () => {
    setNewFolder(true);
  };

  const handleCancelNewFolderClick = () => {
    setNewFolder(false);
    setFolderName("");
  };

  const handleAddFolder = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isComposing && e.key === "Enter" && folderName.trim()) {
      console.log("Creating folder:", folderName);
      await addFolder(folderName.trim());
      setFolderName("");
      setNewFolder(false);
    }
  };

  const handleSelectFolder = (folderId: number | null) => {
    if (folderId === null) {
      fetchNote();
    }
    onSelectFolder(folderId);
  };

  return (
    <div className="w-80 p-4 mt-6">
      <div className="pl-10">
        {!newFolder && (
          <button
            className="hover:scale-105 transition-transform duration-200 bg-gradient-to-r from-yellow-50 to-cyan-50 rounded-2xl w-32 h-11 mb-4 drop-shadow-lg text-gray-500 text-xl"
            onClick={handleNewFolderClick}
          >
            <div className="flex justify-between mx-4">
              <span>New</span> <img className="w-6 ml-1" src={folderIcon} />
              <img className="w-5" src={plus} />
            </div>
          </button>
        )}
        <div className={newFolder ? "block" : "hidden"}>
          <button
            className="hover:scale-105 transition-transform duration-200 bg-gradient-to-r from-yellow-50 to-cyan-50 rounded-2xl w-32 h-11 mb-4 drop-shadow-lg text-gray-500 text-xl"
            onClick={handleCancelNewFolderClick}
          >
            <div className="flex justify-between mx-4">
              <span>New</span> <img className="w-6 ml-1" src={folderIcon} />
              <img className="w-5" src={minus} />
            </div>
          </button>
          <div className="relative flex w-56 h-8 mb-3 items-center">
            <div className="absolute ml-2 mr-1 text-2xl">
              <img className="w-6" src={folderIcon} />
            </div>
            <input
              className="grow pl-9 pr-2 py-1 rounded-lg border border-gray-300 outline-none"
              ref={inputRef}
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              onKeyDown={handleAddFolder}
              onCompositionStart={() => setIsComposing(true)} // 한국어 중복 방지
              onCompositionEnd={() => setIsComposing(false)}
            />
          </div>
        </div>
        <h3
          onClick={() => {
            handleSelectFolder(null);
            nav("/list");
          }}
          className="hover:bg-gray-200 rounded-md mt-1 text-lg flex items-center cursor-pointer"
        >
          <img className="w-5 ml-2 mr-1" src={folderIcon} />
          전체 폴더
        </h3>
        <div className="pl-4 pt-2">
          {folders.map((folder) => (
            <FolderItem
              key={folder.id}
              folder={folder}
              notes={notes}
              onSelectFolder={() => onSelectFolder(folder.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Folder;
