"use client"

import Image from "next/image";
import {supabase} from "../../lib/client";

export default async function Home() {
  async function fetchProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select();
    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
    return data;
  }

  return (
    <div>
      <button onClick={async () => {
        const projects = await fetchProjects();
        console.log(projects);
      }}>  press me </button>

    </div>
  )
}
