"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineCalendar } from "react-icons/ai";
import moment from "moment";

const OtherBlogs = ({ otherBlogs }) => {
  const timeStr = otherBlogs?.createdAt;
  const time = moment(timeStr).format("MMM Do YYYY");

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-10">
        {otherBlogs?.length > 0 &&
          otherBlogs?.map((item, index) => (
            <div key={index}>
              <Link href={`/blog/${item?._id}`}>
                <div>
                  <Image
                    src={item?.image?.url ? item.image.url : "/img/port.jpg"}
                    alt="Other Blog Image"
                    width={400}
                    height={400}
                    size="100vw"
                    className="w-full h-full rounded-lg mb-2"
                  />
                  <div className="space-y-2 ">
                    <div className="flex items-center gap-3 text-ws">
                      <p className="text-primaryColor">{item?.category}</p>
                      <p className="flex items-center gap-1 text-paragraphColor">
                        <AiOutlineCalendar className="text-xl" />
                        {time}
                      </p>
                    </div>
                    <div className=" space-y-2">
                      <h2>{item?.title}</h2>
                      <p className="text-sm text-paragraphColor">
                        {item?.excerpt}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Image
                        src={
                          item?.authorId?.avatar?.url
                            ? item.authorId.avatar.url
                            : "/img/samio.jpg"
                        }
                        alt="picture of the author"
                        width={40}
                        height={40}
                        size="100vw"
                        className="w-10 h-10 rounded-full"
                      />
                      <h6 className="text-xs">{item?.authorId?.name}</h6>
                    </div>
                    <div className="text-sm text-paragraphColor space-y-1">
                      <p className="dark:text-white text-black">
                        {item?.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
      </div>
    </section>
  );
};

export default OtherBlogs;
