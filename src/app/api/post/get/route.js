import { Post } from '@/lib/models/post.model.js';
import { Connect } from '@/lib/mongodb/mongoose.js';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
  try {
    await Connect();
    const data = await req.json();
    
    // Si un slug est fourni, on recherche un post spécifique
    if (data.slug) {
      const post = await Post.findOne({ slug: data.slug });
      
      if (!post) {
        return NextResponse.json(
          { success: false, error: 'Post not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ 
        success: true, 
        posts: [post] 
      });
    }
    
    // Sinon, on gère la récupération des posts avec pagination et filtres
    const startIndex = parseInt(data.startIndex) || 0;
    const limit = parseInt(data.limit) || 9;
    const sortDirection = data.order === 'asc' ? 1 : -1;
    
    const query = {
      ...(data.userId && { userId: data.userId }),
      ...(data.category && { category: data.category }),
      ...(data.postId && { _id: data.postId }),
      ...(data.searchTerm && {
        $or: [
          { title: { $regex: data.searchTerm, $options: 'i' } },
          { content: { $regex: data.searchTerm, $options: 'i' } },
        ],
      }),
    };
    
    // Exécution des requêtes en parallèle
    const [posts, totalPosts] = await Promise.all([
      Post.find(query)
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)
        .limit(limit),
      Post.countDocuments(query)
    ]);

    // Calcul des statistiques pour le mois dernier
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    return NextResponse.json({ 
      success: true,
      posts,
      totalPosts,
      lastMonthPosts 
    });
    
  } catch (error) {
    console.error('Error getting posts:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error fetching posts',
        details: error.message 
      },
      { status: 500 }
    );
  }
};