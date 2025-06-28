"use client";

import Image from "next/image";
import Link from "next/link";
import { AiOutlineCalendar } from 'react-icons/ai';
import moment from 'moment';




const FirstBlog = ({ firstBlog }) => {
  const timeStr = firstBlog?.createdAt;
  const time = moment(timeStr).format("MMM Do YYYY");

  return (
    <section>
      <Link
        href={`/blog/${firstBlog?._id}`}
        className="block mb-8 hover:underline text-2xl font-bold text-gray-800 dark:text-white"
      >
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-full lg:w-2/5">
            <Image
              src={
                firstBlog?.image?.url ? firstBlog.image.url : "/img/port.jpg"
              }
              alt="First Blog Image"
              width={600}
              height={600}
              size="100vw"
              className="w-full h-full rounded-lg"
            />
          </div>
          <div className="w-full lg:w-3/5 space-y-5">
            <div className="flex items-center gap-3 text-ws">
              <p className="text-primaryColor">{firstBlog?.category}</p>
              <p className="flex items-center gap-1 text-paragraphColor">
                <AiOutlineCalendar className="text-xl" />
                {time}
              </p>
            </div>
            <div className=" space-y-2">
              <h2>{firstBlog?.title}</h2>
              <p className="text-sm text-paragraphColor">
                {firstBlog?.excerpt}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Image
                src={
                  firstBlog?.authorId?.avatar?.url
                    ? firstBlog.authorId.avatar.url
                    : "/img/samio.jpg"
                }
                alt="picture of the author"
                width={40}
                height={40}
                size="100vw"
                className="w-10 h-10 rounded-full"
              />
              <h6 className="text-xs">{firstBlog?.authorId?.name}</h6>
            </div>
            <div className="text-sm text-paragraphColor space-y-1">
              <p className="dark:text-white text-black">
                {firstBlog?.designation}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
};

export default FirstBlog;
