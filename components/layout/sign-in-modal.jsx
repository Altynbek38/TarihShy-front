import { signIn } from "next-auth/react";
import {
  useState,
  useCallback,
  useMemo,
  Fragment
} from "react";
import { LoadingDots, Google } from "@/components/shared/icons";
import Image from "next/image";
import { Dialog, Transition } from '@headlessui/react'

const SignInModal = ({
  showSignInModal,
  setShowSignInModal,
}) => {
  const [signInClicked, setSignInClicked] = useState(false);

  return (
    <Transition appear show={showSignInModal} as={Fragment}>
      <Dialog as="div" className="relative z-40" open={showSignInModal} onClose={() => setShowSignInModal(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0">
          <div className="flex min-h-full items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full overflow-hidden shadow-xl md:max-w-md md:rounded-2xl md:border md:border-gray-200 transition-all">
                <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center md:px-16">
                  <Image
                    src="/n17r.png"
                    alt="Logo"
                    className="h-10 w-10 rounded-full"
                    width={20}
                    height={20}
                  />
                  <h3 className="font-display text-2xl font-bold">Sign In</h3>
                </div>

                <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 md:px-16">
                  <button
                    disabled={signInClicked}
                    className={`${signInClicked
                      ? "cursor-not-allowed border-gray-200 bg-gray-100"
                      : "border border-gray-200 bg-white text-black hover:bg-gray-50"
                      } flex h-10 w-full items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}
                    onClick={() => {
                      setSignInClicked(true);
                      signIn("google");
                    }}
                  >
                    {signInClicked ? (
                      <LoadingDots color="#808080" />
                    ) : (
                      <>
                        <Google className="h-5 w-5" />
                        <p>Sign In with Google</p>
                      </>
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export function useSignInModal() {
  const [showSignInModal, setShowSignInModal] = useState(false);

  const SignInModalCallback = useCallback(() => {
    return (
      <SignInModal
        showSignInModal={showSignInModal}
        setShowSignInModal={setShowSignInModal}
      />
    );
  }, [showSignInModal, setShowSignInModal]);

  return useMemo(
    () => ({ setShowSignInModal, SignInModal: SignInModalCallback }),
    [setShowSignInModal, SignInModalCallback],
  );
}
