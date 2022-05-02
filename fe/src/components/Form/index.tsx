import React from 'react';
import gitlabLogo from '../../images/gitlab-logo.png';
import githubLogo from '../../images/github-logo.svg';

const inputFieldBaseClasses =
  'appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm';

const formButtonBaseClasses =
  'px-6 py-3 text-center text-white text-xl rounded-lg transition duration-200 ease flex items-center';

const buttonImgClasses = 'pl-1 h-5';

function Form() {
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
          />
        </div>
        <div>
          <input
            className={`${inputFieldBaseClasses} rounded-b-md`}
            placeholder="Password"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-around w-3/4">
        <button
          className={`${formButtonBaseClasses} bg-purple-600 hover:bg-purple-500 `}
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
