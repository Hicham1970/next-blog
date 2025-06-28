"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import moment from "moment";
import splitParagraph from "@/lib/splitParagraph";


import {
  AiFillDelete,
  AiFillHeart,
  AiOutlineComment,
  AiOutlineCalendar,
  AiTowToneCalendar,
} from "react-icons/ai";
import { BsFillPencilFill, BsTrash } from "react-icons/bs";
import InputCompo from "@/components/InputCompo";

const BlogDetails = ({ params }) => {
  const [blogDetails, setBlogDetails] = useState({});
  const router = useRouter();
  const { data: session, status } = useSession();
  const timeStr = blogDetails?.createdAt;
  const time = moment(timeStr).format("MMM Do YYYY");

  async function fetchBlog() {
    try {
      const response = await fetch(
        `http://localhost:3000/api/blog/${params.id}`,
        {
          cache: "no-store", // Disable caching for this request
        }
      );
      const blog = await response.json();
      setBlogDetails(blog);
    } catch (error) {
      console.error("Error fetching blog details:", error);
    }
  }

  useEffect(() => {
    fetchBlog();
  }, []);

  return (
    <section className="container max-w-3xl ">
      {blogDetails?.authorId?._id.toString() ===
        session?.user?._id.toString() && (
        <div className="flex items-center justify-end gap-5">
          <Link href="" className="flex items-center gap-1 test-primaryColor ">
            <BsFillPencilFill />
            Edit
          </Link>
          <button className="flex items-center gap-1 text-red-500 ">
            <BsTrash />
            Delete
          </button>
        </div>
      )}

      <div className="flex flex-col items-center justify-center">
        <Link
          href={`/user/${blogDetails?.authorId?._id.toString()}`}
          className="flex items-center gap-1  text-primaryColor"
        >
          <div className="flex flex-col justify-center items-center py-10">
            <Image
              src={
                blogDetails?.authorId?.avatar?.url
                  ? blogDetails?.authorId?.avatar?.url
                  : "/img/port.jpg"
              }
              alt="Avatar Image"
              width={60}
              height={60}
              size="100vw"
              className="w-20 h-20 rounded-full"
            />
            <div className="text-center">
              <p className="text-primaryColor">{blogDetails?.authorId?.name}</p>
              <p className="flex items-center gap-1 text-paragraphColor">
                {blogDetails?.designation}
              </p>
            </div>
          </div>
        </Link>

        <div className="text-center space-y-3">
          <h2>{blogDetails?.title}</h2>
          <p>{blogDetails?.excerpt}</p>
          <p className="flex items-center justify-center gap-3">
            <span className="text-primaryColor">{blogDetails?.category}</span>
            <span className="flex items-center gap-1 text-paragraphColor">
              <AiOutlineCalendar className="text-xl" />
              {moment().format("MMM Do YYYY")}
            </span>
          </p>
          <div className="">
            <Image
              src={
                blogDetails?.image ? blogDetails?.image.url : "/img/port.jpg"
              }
              alt="blog details Image"
              width={600}
              height={600}
              size="100vw"
              className="w-full h-full rounded-lg py-10"
            />
          </div>
          <div className="text-start">
            <div className="space-y-5">
              {blogDetails?.description && splitParagraph(blogDetails?.description).map((paragraph, pIndex) => (
                  <div key={pIndex}>
                      {pIndex === Math.floor(splitParagraph(blogDetails?.description).length / 2) && (
                          <blockquote className="border-l-4 border-primaryColor border-space-6 italic mb-4">
                              <p className="ml-5">{ blogDetails?.quote}</p>
                              
                          </blockquote>
                      )}
                      {paragraph}
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="py-12">
        <div className="flex gap-10 items-center justify-center">
          <div className="flex items-center gap-1">
            <p>12</p>
            <AiFillHeart size={20} color="#ed5784" cursor="pointer" />
            <AiFillHeart size={20} cursor="pointer" />
          </div>
          <div className="flex items-center gap-1">
            <p>16</p>
            <AiOutlineComment size={20} />
          </div>
        </div>
      </div>
      <div className="">
        <h3 className="text-red-500">Kindly login to leave a comment</h3>
        <form className="space-y-2">
          <InputCompo
            name="comment"
            type="text"
            placeholder="type your comment"
          />
          <button type="submit" className="btn">
            Comment
          </button>
        </form>
        <div className="flex gap-3 items-center">
          <Image
            src="/img/port.jpg"
            alt="Avatar Image"
            width={60}
            height={60}
            size="100vw"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-black dark:text-white">John Doe</p>
            <p>This is our first comment</p>
          </div>
          <BsTrash cursor="pointer" className="text-red-500" ml-10 />
        </div>
      </div>
    </section>
  );
};

export default BlogDetails;
