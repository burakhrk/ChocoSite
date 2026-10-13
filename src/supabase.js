import { createClient } from '@supabase/supabase-js';

// Bu iki değer tarayıcıya açık olacak şekilde tasarlanmıştır; yazma yetkisi
// veritabanındaki erişim kurallarıyla (supabase/schema.sql) sınırlanır.
const SUPABASE_URL = 'https://uaygeajznocckmtcilbg.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_tnaTGiOxr2lghjOeMcI0cw_sI9whncw';

const CONTENT_TABLE = 'site_content';
const CONTENT_ROW_ID = 1;
const IMAGE_BUCKET = 'product-images';

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// { data } içerik var, { missing: true } henüz yayınlanmamış, { error } ulaşılamadı.
export const fetchContent = async () => {
  try {
    const { data, error } = await supabase
      .from(CONTENT_TABLE)
      .select('data')
      .eq('id', CONTENT_ROW_ID)
      .maybeSingle();
    if (error) return { error };
    return data ? { data: data.data } : { missing: true };
  } catch (error) {
    return { error };
  }
};

export const saveContent = async (content) => {
  try {
    const { error } = await supabase
      .from(CONTENT_TABLE)
      .upsert({ id: CONTENT_ROW_ID, data: content, updated_at: new Date().toISOString() });
    return !error;
  } catch (error) {
    return false;
  }
};

export const uploadImage = async (dataUrl) => {
  const blob = await (await fetch(dataUrl)).blob();
  const extension = (blob.type.split('/')[1] || 'webp').replace('jpeg', 'jpg');
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, blob, { contentType: blob.type, cacheControl: '31536000' });
  if (error) throw error;
  return supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
};

export const watchSession = (onChange) => {
  supabase.auth.getSession().then(({ data }) => onChange(Boolean(data.session)));
  const { data } = supabase.auth.onAuthStateChange((_event, session) => onChange(Boolean(session)));
  return () => data.subscription.unsubscribe();
};

export const signIn = async (email, password) => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return !error;
};

export const signOut = () => supabase.auth.signOut();
