import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// Replace with your actual Supabase URL and anon key when ready for production
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// User session management
export async function signInWithEmail(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Wellness profile management
export async function createWellnessProfile(userId: string, profile: any) {
  const { data, error } = await supabase
    .from('wellness_profiles')
    .insert([
      { 
        user_id: userId,
        ...profile
      }
    ])
    .select();
  
  return { data, error };
}

export async function getWellnessProfile(userId: string) {
  const { data, error } = await supabase
    .from('wellness_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  return { data, error };
}

// Wellness journeys and interactions
export async function saveJourneyInteraction(userId: string, interaction: any) {
  const { data, error } = await supabase
    .from('journey_interactions')
    .insert([
      { 
        user_id: userId,
        timestamp: new Date(),
        ...interaction
      }
    ]);
  
  return { data, error };
}

export async function getJourneyHistory(userId: string) {
  const { data, error } = await supabase
    .from('journey_interactions')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false });
  
  return { data, error };
}

// Event booking
export async function bookEvent(userId: string, eventDetails: any) {
  const { data, error } = await supabase
    .from('event_bookings')
    .insert([
      { 
        user_id: userId,
        booking_time: new Date(),
        ...eventDetails
      }
    ]);
  
  return { data, error };
}

export async function getUserBookings(userId: string) {
  const { data, error } = await supabase
    .from('event_bookings')
    .select('*')
    .eq('user_id', userId);
  
  return { data, error };
}
