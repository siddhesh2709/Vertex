import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';

const app = new Hono();

app.use('*', logger(console.log));
app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Storage bucket setup
async function initStorage() {
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketName = 'make-e63c4de1-farmimages';
  const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
  if (!bucketExists) {
    await supabase.storage.createBucket(bucketName, { public: false });
  }
}
initStorage();

// Helper function to verify user
async function verifyUser(request: Request) {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return null;
  }
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return null;
  }
  return user;
}

// ============ AUTH ROUTES ============

app.post('/make-server-e63c4de1/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, location, bio, farmType } = body;

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, location, bio, farmType },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.log('Signup exception:', error);
    return c.json({ error: 'Signup failed' }, 500);
  }
});

app.post('/make-server-e63c4de1/login', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
    );

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log('Login error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ 
      session: data.session,
      user: data.user 
    });
  } catch (error) {
    console.log('Login exception:', error);
    return c.json({ error: 'Login failed' }, 500);
  }
});

// ============ CROP RECOMMENDATION ============

app.post('/make-server-e63c4de1/recommend-crops', async (c) => {
  const user = await verifyUser(c.req.raw);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const body = await c.req.json();
    const { soilType, landArea, location, season } = body;

    // Mock crop recommendation logic (in production, this would use ML models)
    const cropDatabase: Record<string, any[]> = {
      'clay': [
        { name: 'Rice', yield: 2.5, duration: 120, waterReq: 'High', profitPerAcre: 45000 },
        { name: 'Wheat', yield: 1.8, duration: 130, waterReq: 'Medium', profitPerAcre: 38000 },
        { name: 'Cotton', yield: 1.2, duration: 180, waterReq: 'Medium', profitPerAcre: 52000 }
      ],
      'sandy': [
        { name: 'Pearl Millet', yield: 1.5, duration: 90, waterReq: 'Low', profitPerAcre: 25000 },
        { name: 'Groundnut', yield: 1.0, duration: 120, waterReq: 'Medium', profitPerAcre: 42000 },
        { name: 'Watermelon', yield: 3.0, duration: 80, waterReq: 'Medium', profitPerAcre: 55000 }
      ],
      'loamy': [
        { name: 'Tomato', yield: 4.0, duration: 90, waterReq: 'Medium', profitPerAcre: 65000 },
        { name: 'Potato', yield: 3.5, duration: 100, waterReq: 'Medium', profitPerAcre: 58000 },
        { name: 'Soybean', yield: 1.2, duration: 110, waterReq: 'Medium', profitPerAcre: 40000 }
      ],
      'black': [
        { name: 'Cotton', yield: 1.5, duration: 180, waterReq: 'Medium', profitPerAcre: 60000 },
        { name: 'Sugarcane', yield: 5.0, duration: 365, waterReq: 'High', profitPerAcre: 85000 },
        { name: 'Chickpea', yield: 0.9, duration: 120, waterReq: 'Low', profitPerAcre: 35000 }
      ],
      'red': [
        { name: 'Ragi', yield: 1.2, duration: 120, waterReq: 'Low', profitPerAcre: 28000 },
        { name: 'Pulses', yield: 0.8, duration: 100, waterReq: 'Low', profitPerAcre: 32000 },
        { name: 'Maize', yield: 2.0, duration: 90, waterReq: 'Medium', profitPerAcre: 38000 }
      ]
    };

    const recommendations = cropDatabase[soilType.toLowerCase()] || cropDatabase['loamy'];
    
    const results = recommendations.map(crop => ({
      ...crop,
      totalYield: crop.yield * landArea,
      totalProfit: crop.profitPerAcre * landArea,
      totalCost: (crop.profitPerAcre * 0.6) * landArea,
      netProfit: (crop.profitPerAcre * 0.4) * landArea
    }));

    return c.json({ 
      recommendations: results,
      location,
      season,
      landArea
    });
  } catch (error) {
    console.log('Crop recommendation error:', error);
    return c.json({ error: 'Failed to generate recommendations' }, 500);
  }
});

// ============ CROP ROADMAP ============

app.post('/make-server-e63c4de1/generate-roadmap', async (c) => {
  const user = await verifyUser(c.req.raw);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const body = await c.req.json();
    const { cropName, landArea, startDate } = body;

    // Mock roadmap generation (in production, this would be more sophisticated)
    const roadmapTemplates: Record<string, any[]> = {
      'Rice': [
        { week: 1, task: 'Land Preparation', description: 'Plough the field 2-3 times, level the land', status: 'pending' },
        { week: 2, task: 'Seed Selection & Treatment', description: 'Select healthy seeds, treat with fungicide', status: 'pending' },
        { week: 3, task: 'Sowing/Transplanting', description: 'Transplant 20-25 day old seedlings', status: 'pending' },
        { week: 5, task: 'First Irrigation', description: 'Maintain 5cm water level', status: 'pending' },
        { week: 7, task: 'Fertilizer Application', description: 'Apply urea 25kg/acre', status: 'pending' },
        { week: 10, task: 'Pest Control', description: 'Monitor for stem borers, apply pesticide if needed', status: 'pending' },
        { week: 14, task: 'Second Fertilizer Dose', description: 'Apply DAP 20kg/acre', status: 'pending' },
        { week: 17, task: 'Harvest Preparation', description: 'Stop irrigation 10 days before harvest', status: 'pending' },
        { week: 18, task: 'Harvesting', description: 'Harvest when grains are golden yellow', status: 'pending' }
      ],
      'Wheat': [
        { week: 1, task: 'Land Preparation', description: 'Deep ploughing, add organic manure', status: 'pending' },
        { week: 2, task: 'Seed Treatment', description: 'Treat seeds with Trichoderma', status: 'pending' },
        { week: 3, task: 'Sowing', description: 'Line sowing at 20cm spacing', status: 'pending' },
        { week: 4, task: 'First Irrigation', description: 'Light irrigation after germination', status: 'pending' },
        { week: 6, task: 'Weed Control', description: 'Manual weeding or herbicide application', status: 'pending' },
        { week: 8, task: 'Fertilizer Application', description: 'Top dressing with urea', status: 'pending' },
        { week: 12, task: 'Disease Monitoring', description: 'Check for rust, apply fungicide if needed', status: 'pending' },
        { week: 16, task: 'Stop Irrigation', description: 'Last irrigation before harvest', status: 'pending' },
        { week: 19, task: 'Harvesting', description: 'Harvest when ears turn golden', status: 'pending' }
      ],
      'Tomato': [
        { week: 1, task: 'Nursery Preparation', description: 'Prepare nursery beds, sow seeds', status: 'pending' },
        { week: 3, task: 'Land Preparation', description: 'Plough field, make raised beds', status: 'pending' },
        { week: 4, task: 'Transplanting', description: 'Transplant 25-30 day seedlings', status: 'pending' },
        { week: 5, task: 'Staking', description: 'Provide bamboo/wooden stakes for support', status: 'pending' },
        { week: 6, task: 'First Fertilizer', description: 'Apply NPK 19:19:19', status: 'pending' },
        { week: 8, task: 'Pruning', description: 'Remove side shoots, maintain 1-2 stems', status: 'pending' },
        { week: 10, task: 'Disease Control', description: 'Spray for early blight prevention', status: 'pending' },
        { week: 11, task: 'Fruit Setting', description: 'Monitor flowering, ensure proper pollination', status: 'pending' },
        { week: 13, task: 'First Harvest', description: 'Pick fruits when fully red', status: 'pending' }
      ],
      'Cotton': [
        { week: 1, task: 'Land Preparation', description: 'Deep summer ploughing', status: 'pending' },
        { week: 2, task: 'Seed Treatment', description: 'Treat with fungicide and insecticide', status: 'pending' },
        { week: 3, task: 'Sowing', description: 'Sow seeds at 60x30cm spacing', status: 'pending' },
        { week: 5, task: 'Thinning', description: 'Maintain 1-2 plants per hill', status: 'pending' },
        { week: 7, task: 'First Fertilizer', description: 'Apply urea and DAP', status: 'pending' },
        { week: 10, task: 'Pest Control', description: 'Monitor for bollworms, apply IPM', status: 'pending' },
        { week: 14, task: 'Flowering Stage', description: 'Ensure adequate moisture', status: 'pending' },
        { week: 20, task: 'Boll Formation', description: 'Monitor boll development', status: 'pending' },
        { week: 26, task: 'Harvesting', description: 'Pick cotton when bolls open', status: 'pending' }
      ]
    };

    const template = roadmapTemplates[cropName] || roadmapTemplates['Tomato'];
    
    const roadmap = {
      cropName,
      landArea,
      startDate,
      totalWeeks: template[template.length - 1].week,
      tasks: template
    };

    // Save roadmap to KV store
    const roadmapId = `roadmap_${user.id}_${Date.now()}`;
    await supabase.from('kv_store_e63c4de1').insert({
      key: roadmapId,
      value: JSON.stringify({ ...roadmap, userId: user.id })
    });

    return c.json({ roadmap, roadmapId });
  } catch (error) {
    console.log('Roadmap generation error:', error);
    return c.json({ error: 'Failed to generate roadmap' }, 500);
  }
});

// ============ DISEASE DETECTION ============

app.post('/make-server-e63c4de1/detect-disease', async (c) => {
  const user = await verifyUser(c.req.raw);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const body = await c.req.json();
    const { imageBase64, cropType } = body;

    // Mock disease detection (in production, this would use a trained CNN model)
    const diseases = [
      {
        name: 'Early Blight',
        confidence: 0.87,
        description: 'Fungal disease causing dark brown spots with concentric rings on leaves',
        treatment: [
          'Remove and destroy infected leaves',
          'Apply Mancozeb fungicide (2g/liter)',
          'Maintain proper spacing for air circulation',
          'Avoid overhead irrigation'
        ],
        prevention: [
          'Use disease-free seeds',
          'Crop rotation with non-host crops',
          'Apply mulch to prevent soil splash',
          'Maintain balanced fertilization'
        ]
      },
      {
        name: 'Bacterial Leaf Spot',
        confidence: 0.72,
        description: 'Bacterial infection causing small water-soaked spots on leaves',
        treatment: [
          'Apply copper-based bactericide',
          'Remove severely infected plants',
          'Avoid working in wet fields',
          'Use drip irrigation instead of sprinkler'
        ],
        prevention: [
          'Use certified disease-free seeds',
          'Practice crop rotation',
          'Avoid excessive nitrogen fertilization',
          'Maintain field sanitation'
        ]
      },
      {
        name: 'Powdery Mildew',
        confidence: 0.65,
        description: 'Fungal disease showing white powdery coating on leaves',
        treatment: [
          'Spray sulfur-based fungicide',
          'Apply neem oil spray (5ml/liter)',
          'Remove severely affected leaves',
          'Improve air circulation'
        ],
        prevention: [
          'Avoid overhead watering',
          'Plant resistant varieties',
          'Maintain proper plant spacing',
          'Apply preventive sulfur dust'
        ]
      }
    ];

    // Simulate AI detection by randomly selecting a disease
    const detectedDisease = diseases[Math.floor(Math.random() * diseases.length)];

    // Store image in Supabase Storage
    const bucketName = 'make-e63c4de1-farmimages';
    const fileName = `disease_${user.id}_${Date.now()}.jpg`;
    
    // Convert base64 to blob
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType: 'image/jpeg'
      });

    if (uploadError) {
      console.log('Image upload error:', uploadError);
    }

    // Save detection history
    const detectionId = `detection_${user.id}_${Date.now()}`;
    await supabase.from('kv_store_e63c4de1').insert({
      key: detectionId,
      value: JSON.stringify({
        userId: user.id,
        cropType,
        disease: detectedDisease,
        timestamp: new Date().toISOString(),
        imagePath: fileName
      })
    });

    return c.json({ 
      detection: detectedDisease,
      detectionId 
    });
  } catch (error) {
    console.log('Disease detection error:', error);
    return c.json({ error: 'Failed to detect disease' }, 500);
  }
});

// ============ SOCIAL FEATURES ============

app.post('/make-server-e63c4de1/posts', async (c) => {
  const user = await verifyUser(c.req.raw);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const body = await c.req.json();
    const { content, imageBase64 } = body;

    let imagePath = null;
    if (imageBase64) {
      const bucketName = 'make-e63c4de1-farmimages';
      const fileName = `post_${user.id}_${Date.now()}.jpg`;
      
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, buffer, { contentType: 'image/jpeg' });

      if (!uploadError) {
        imagePath = fileName;
      }
    }

    const postId = `post_${Date.now()}`;
    const post = {
      id: postId,
      userId: user.id,
      userName: user.user_metadata.name || user.email,
      userLocation: user.user_metadata.location || '',
      content,
      imagePath,
      likes: 0,
      comments: 0,
      timestamp: new Date().toISOString()
    };

    await supabase.from('kv_store_e63c4de1').insert({
      key: postId,
      value: JSON.stringify(post)
    });

    return c.json({ post });
  } catch (error) {
    console.log('Create post error:', error);
    return c.json({ error: 'Failed to create post' }, 500);
  }
});

app.get('/make-server-e63c4de1/posts', async (c) => {
  const user = await verifyUser(c.req.raw);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { data, error } = await supabase
      .from('kv_store_e63c4de1')
      .select('*')
      .like('key', 'post_%')
      .order('key', { ascending: false })
      .limit(50);

    if (error) {
      console.log('Fetch posts error:', error);
      return c.json({ posts: [] });
    }

    const posts = await Promise.all((data || []).map(async (item: any) => {
      const post = JSON.parse(item.value);
      
      // Get signed URL for image if exists
      if (post.imagePath) {
        const { data: signedUrlData } = await supabase.storage
          .from('make-e63c4de1-farmimages')
          .createSignedUrl(post.imagePath, 3600);
        
        if (signedUrlData) {
          post.imageUrl = signedUrlData.signedUrl;
        }
      }
      
      return post;
    }));

    return c.json({ posts });
  } catch (error) {
    console.log('Fetch posts exception:', error);
    return c.json({ posts: [] });
  }
});

app.post('/make-server-e63c4de1/posts/:postId/like', async (c) => {
  const user = await verifyUser(c.req.raw);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const postId = c.req.param('postId');
    
    const { data, error } = await supabase
      .from('kv_store_e63c4de1')
      .select('*')
      .eq('key', postId)
      .single();

    if (error || !data) {
      return c.json({ error: 'Post not found' }, 404);
    }

    const post = JSON.parse(data.value);
    post.likes = (post.likes || 0) + 1;

    await supabase
      .from('kv_store_e63c4de1')
      .update({ value: JSON.stringify(post) })
      .eq('key', postId);

    return c.json({ post });
  } catch (error) {
    console.log('Like post error:', error);
    return c.json({ error: 'Failed to like post' }, 500);
  }
});

app.post('/make-server-e63c4de1/posts/:postId/comment', async (c) => {
  const user = await verifyUser(c.req.raw);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const postId = c.req.param('postId');
    const body = await c.req.json();
    const { content } = body;

    const commentId = `comment_${postId}_${Date.now()}`;
    const comment = {
      id: commentId,
      postId,
      userId: user.id,
      userName: user.user_metadata.name || user.email,
      content,
      timestamp: new Date().toISOString()
    };

    await supabase.from('kv_store_e63c4de1').insert({
      key: commentId,
      value: JSON.stringify(comment)
    });

    // Update post comment count
    const { data } = await supabase
      .from('kv_store_e63c4de1')
      .select('*')
      .eq('key', postId)
      .single();

    if (data) {
      const post = JSON.parse(data.value);
      post.comments = (post.comments || 0) + 1;
      await supabase
        .from('kv_store_e63c4de1')
        .update({ value: JSON.stringify(post) })
        .eq('key', postId);
    }

    return c.json({ comment });
  } catch (error) {
    console.log('Comment post error:', error);
    return c.json({ error: 'Failed to comment' }, 500);
  }
});

app.get('/make-server-e63c4de1/posts/:postId/comments', async (c) => {
  const user = await verifyUser(c.req.raw);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const postId = c.req.param('postId');
    
    const { data, error } = await supabase
      .from('kv_store_e63c4de1')
      .select('*')
      .like('key', `comment_${postId}_%`)
      .order('key', { ascending: true });

    if (error) {
      return c.json({ comments: [] });
    }

    const comments = (data || []).map((item: any) => JSON.parse(item.value));
    return c.json({ comments });
  } catch (error) {
    console.log('Fetch comments error:', error);
    return c.json({ comments: [] });
  }
});

// ============ MARKET ANALYTICS ============

app.get('/make-server-e63c4de1/market-prices', async (c) => {
  const user = await verifyUser(c.req.raw);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    // Mock market price data
    const marketPrices = [
      { crop: 'Rice', price: 2100, unit: 'quintal', trend: 'up', change: 5.2 },
      { crop: 'Wheat', price: 2050, unit: 'quintal', trend: 'up', change: 3.1 },
      { crop: 'Cotton', price: 5800, unit: 'quintal', trend: 'down', change: -2.3 },
      { crop: 'Tomato', price: 1200, unit: 'quintal', trend: 'up', change: 12.5 },
      { crop: 'Potato', price: 800, unit: 'quintal', trend: 'down', change: -5.8 },
      { crop: 'Sugarcane', price: 315, unit: 'quintal', trend: 'stable', change: 0.5 },
      { crop: 'Soybean', price: 4200, unit: 'quintal', trend: 'up', change: 4.7 },
      { crop: 'Maize', price: 1850, unit: 'quintal', trend: 'up', change: 2.9 }
    ];

    return c.json({ prices: marketPrices });
  } catch (error) {
    console.log('Market prices error:', error);
    return c.json({ error: 'Failed to fetch market prices' }, 500);
  }
});

// ============ USER PROFILE ============

app.get('/make-server-e63c4de1/profile/:userId', async (c) => {
  const user = await verifyUser(c.req.raw);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const userId = c.req.param('userId');
    
    // Get user info
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
    if (userError || !userData) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Get user's posts
    const { data: postsData } = await supabase
      .from('kv_store_e63c4de1')
      .select('*')
      .like('key', 'post_%')
      .order('key', { ascending: false });

    const userPosts = (postsData || [])
      .map((item: any) => JSON.parse(item.value))
      .filter((post: any) => post.userId === userId);

    const profile = {
      id: userData.user.id,
      name: userData.user.user_metadata.name || userData.user.email,
      email: userData.user.email,
      location: userData.user.user_metadata.location || '',
      bio: userData.user.user_metadata.bio || '',
      farmType: userData.user.user_metadata.farmType || '',
      postsCount: userPosts.length,
      joinedDate: userData.user.created_at
    };

    return c.json({ profile, posts: userPosts });
  } catch (error) {
    console.log('Profile fetch error:', error);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

Deno.serve(app.fetch);
