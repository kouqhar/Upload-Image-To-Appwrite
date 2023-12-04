import React, { useState, useEffect } from 'react';
import { account, ID, storage } from './lib/appwrite';
import "./App.css"

// Environment Variables
const { VITE_BUCKET_ID }= import.meta.env

const App = () => {

  const [loggedInUser, setLoggedInUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [picture, setPicture] = useState('')
  const [images, setImages] = useState("")
  const [previewImage, setPreviewImage] = useState("")
  const [isBtnActive, setIsBtnActive] = useState(false)

  async function login(email, password) {
    await account.createEmailSession(email, password);
    setLoggedInUser(await account.get());
  }

  const addProfilePicture = async (e) => {
    e.preventDefault()
    setIsBtnActive(true)

    const promise = storage.createFile(
        VITE_BUCKET_ID,
        ID.unique(),
        picture ? picture : null
    );

    promise.then(function (response) {
        const isUser = response?.$permissions[0].split(":")[1].replace("\")", "") === loggedInUser?.$id

        if(isUser){
          setImages([response?.bucketId, response?.$id])
          setIsBtnActive(false)
        } // Success
    }, function (error) {
        console.log(error); // Failure
    });
  }

  useEffect(() => {
    const promise = storage.listFiles(VITE_BUCKET_ID);

    promise.then(function (response) { // Success
        const result = response?.files
        const name = loggedInUser?.name
        const userId = loggedInUser?.$id

        const uploads = result.map(elem => elem?.$permissions[0].split(":")[1].replace("\")", "") === userId ? elem : null).at(-1)
        setImages([uploads?.bucketId, uploads?.$id])

    }, function (error) {
        console.log(error); // Failure
    });
  }, [loggedInUser])

  useEffect(() => {
    if(images[0] !== undefined){
        const bucketId = images[0]
        const imageId = images[1]
    
        const result = storage.getFilePreview(bucketId, imageId);
        setPreviewImage(result?.href) // Resource URL
      }else return;
  }, [images])

  return (
    <div>
    {
      loggedInUser ? (
        <div className="display_image">
          <img src={previewImage} alt={name} />

          <div className="upload_image">
            <input type="file" id="uploader" onChange={(e) => setPicture(e.target.files[0])} />
            <button onClick={addProfilePicture} disabled={isBtnActive} >
              {isBtnActive ? `Uploading . . .` : `Upload Image`}
            </button>
          </div>
        </div>

      ) : (
        <div className='form_notice'>
          <h2>Please LOGIN or REGISTER Below !!!</h2>
          <p>Fill ALL FORM FIELDS to REGISTER OR;</p>
          <p>Only fill EMAIL and PASSWORD to Login</p>
        </div>
        )
    }

    <div className="content">
      <p>
        {loggedInUser ? `Logged in as ${loggedInUser.name}` : 'Not logged in'}
      </p>

      <form>
        {!loggedInUser ?
        <>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
  
          <button type="button" onClick={() => login(email, password)}>
            Login
          </button>
  
          <button
            type="button"
            onClick={async () => {
              await account.create(ID.unique(), email, password, name);
              login(email, password);
            }}
          >
            Register
          </button>
        </> : null
        }

        <button
          type="button"
          onClick={async () => {
            await account.deleteSession('current');
            setLoggedInUser(null);
            setPreviewImage("")
          }}
        >
          Logout
        </button>
      </form>
      </div>

    </div>
  );
};

export default App;