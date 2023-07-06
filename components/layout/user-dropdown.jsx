"use client";

import { Fragment } from "react";
import { signOut } from "next-auth/react";
import { ArrowRightOnRectangleIcon } from '@heroicons/react/20/solid'
import Image from "next/image";
import { Menu, Transition } from '@headlessui/react'
import { Session } from "next-auth";
import cx from 'classnames'

export default function UserDropdown({ session }) {
  const { email, image } = session?.user || {};

  if (!email) return null;

  return (
    <div className="relative inline-block text-left">
      <Menu as="div" className="relative ml-3">
        <div>
          <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
            <span className="sr-only">Open user menu</span>
            <Image
              alt={email}
              src={image || `https://avatars.dicebear.com/api/micah/${email}.svg`}
              width={40}
              height={40}
              className="rounded-full"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={cx(active ? 'bg-gray-100' : '', 'relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-sm text-gray-700')}
                  onClick={() => signOut()}
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  <p className="text-sm">Sign out</p>
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
