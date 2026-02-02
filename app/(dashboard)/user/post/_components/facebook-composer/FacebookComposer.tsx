"use client";

import React, { useState } from "react";
import PostEditor from "./PostEditor";
import PostPreview from "./PostPreview";


export default function FacebookComposer() {
  const [postContent, setPostContent] = useState("");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PostEditor postContent={postContent} setPostContent={setPostContent} />
      <PostPreview postContent={postContent} />
    </div>
  );
}