import React, { useState } from 'react';
import gitlabLogo from '../images/gitlab-logo.png';
import githubLogo from '../images/github-logo.svg';
import API from '../api';
import apiConfig from '../api/api-config';
import { OAUTH_RETURN_URL } from '../constants';

const inputFieldBaseClasses =
  'appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm';

const formButtonBaseClasses =
  'px-6 py-3 text-center text-white text-xl rounded-lg transition duration-200 ease flex items-center justify-center';

const buttonImgClasses = 'pl-1 h-5';

type User = {
  id: number;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

function Form() {
  const [windowObjRef, setWindowObjRef] = useState<Window | null>(null);
  const [previousURL, setPreviousURL] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const receiveMessage = (event: MessageEvent) => {
    const { data } = event;
    if (data.isSuccess) {
      alert(`Success for ${data.providerType} OAuth`);
    } else {
      alert(`Failed for ${data.providerType} OAuth`);
    }
  };

  const openSignInWindow = (url: string, name: string) => {
    // remove any existing event listeners
    window.removeEventListener('message', receiveMessage);

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const popupWindowWidth = 600;
    const popupWindowHeight = 700;

    // window features
    const strWindowFeatures = `toolbar=no, menubar=no, width=${popupWindowWidth}, height=${popupWindowHeight}, top=${
      Math.round(windowHeight / 2) - popupWindowHeight / 2
    }, left=${Math.round(windowWidth / 2) - popupWindowWidth / 2}`;

    if (windowObjRef === null || windowObjRef.closed) {
      /* if the pointer to the window object in memory does not exist
      or if such pointer exists but the window was closed */
      setWindowObjRef(window.open(url, name, strWindowFeatures));
    } else if (previousURL !== url) {
      /* if the resource to load is different,
      then we load it in the already opened secondary window and then
      we bring such window back on top/in front of its parent window. */
      setWindowObjRef(window.open(url, name, strWindowFeatures));
      windowObjRef.focus();
    } else {
      /* else the window reference must exist and the window
      is not closed; therefore, we can bring it back on top of any other
      window with the focus() method. There would be no need to re-create
      the window or to reload the referenced resource. */
      windowObjRef.focus();
    }

    // add the listener for receiving a message from the popup
    window.addEventListener('message', (event) => receiveMessage(event), false);
    // assign the previous URL
    setPreviousURL(url);
  };

  const signUpHandler = () => {
    if (username && password) {
      return API.post<User>({
        url: apiConfig.signup,
        data: {
          username,
          password,
        },
      });
    }
  };

  const gitlabOAuthHandler = async () => {
    API.get<string>({
      url: apiConfig.getGitlabOAuthRedirectURI,
      query: { returnURL: OAUTH_RETURN_URL },
      auth: { username, password },
    })
      .then(({ data }) => {
        openSignInWindow(data, 'gitlab-oauth');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="w-1/2 max-w-md h-1/2 max-h-xl flex items-center flex-col items-center content-center">
      <h1 className="text-center text-2xl font-bold mb-8">
        Git OAuth Integration
      </h1>
      <div className="rounded-md shadow-sm -space-y-px w-3/4">
        <div>
          <input
            className={`${inputFieldBaseClasses} rounded-t-md`}
            placeholder="Username"
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div>
          <input
            className={`${inputFieldBaseClasses} rounded-b-md`}
            placeholder="Password"
            type="password"
            onChange={(event) => setPassword(event.target.value.trim())}
          />
        </div>
      </div>

      <button
        className={`${formButtonBaseClasses} bg-blue-600 hover:bg-blue-500 mt-4 w-3/4`}
        onClick={() => signUpHandler()}
      >
        Sign Up
      </button>

      <div className="mt-8 flex justify-between w-3/4">
        <button
          className={`${formButtonBaseClasses} bg-purple-600 hover:bg-purple-500 `}
          onClick={() => gitlabOAuthHandler()}
        >
          GitLab
          <img src={gitlabLogo} className={buttonImgClasses} />
        </button>

        <button
          className={`${formButtonBaseClasses} bg-gray-800 hover:bg-gray-700 `}
        >
          GitHub
          <img src={githubLogo} className={buttonImgClasses} />
        </button>
      </div>
    </div>
  );
}

export default Form;
