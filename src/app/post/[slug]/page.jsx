import CallToAction from '@/components/CallToAction';
import { Button } from 'flowbite-react';
import Link from 'next/link';

export default async function PostPage({ params }) {
  let post = null;
  let error = null;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/post/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ slug: params.slug }),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch post');
    }

    const data = await response.json();
    
    if (!data.posts || data.posts.length === 0) {
      throw new Error('Post not found');
    }
    
    post = data.posts[0];
  } catch (err) {
    console.error('Error fetching post:', err);
    error = err.message;
  }

  if (error || !post) {
    return (
      <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
        <h2 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
          {error || 'Post not found'}
        </h2>
        <Link href="/" className='text-center mt-4 text-blue-600 hover:underline'>
          Return to home
        </Link>
      </main>
    );
  }

  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
        {post.title}
      </h1>
      
      {post.category && (
        <Link
          href={`/search?category=${post.category}`}
          className='self-center mt-5'
        >
          <Button color='gray' pill size='xs'>
            {post.category}
          </Button>
        </Link>
      )}
      
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className='mt-10 p-3 max-h-[600px] w-full object-cover'
        />
      )}
      
      <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        <span className='italic'>
          {post.content ? Math.ceil(post.content.length / 1000) : 0} mins read
        </span>
      </div>
      
      <div
        className='p-3 max-w-2xl mx-auto w-full post-content'
        dangerouslySetInnerHTML={{ __html: post.content || '' }}
      />
      
      <div className='max-w-4xl mx-auto w-full'>
        <CallToAction />
      </div>
    </main>
  );
}