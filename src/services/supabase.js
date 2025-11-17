// client/src/services/supabase.js
import { createClient } from '@supabase/supabase-js';

// Get these from your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// --- 1. Create and Export the Single Client ---
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- 2. Add All Your Auth Functions Here ---
export async function signInWithPassword({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });
  if (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
}

export async function signUp({ email, password, options }) {
  const { data, error } = await supabase.auth.signUp({ email, password, options });
  if (error) throw error;
  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
}

/**
 * Uploads an image file to the 'menu-images' bucket.
 * @param {File} file The file object from an <input type="file">
 * @returns {string} The public URL of the uploaded image.
 */
export async function uploadImage(file) {
  // 1. Create a unique file name
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  // 2. Upload the file to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('menu-images') // Your bucket name
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    throw uploadError;
  }

  // 3. Get the public URL of the uploaded file
  const { data } = supabase.storage
    .from('menu-images')
    .getPublicUrl(filePath);

  if (!data.publicUrl) {
    throw new Error('Could not get public URL for image.');
  }
  
  return data.publicUrl;
}