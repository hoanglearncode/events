"use client";

import React, { useState } from "react";
import PostEditor from "./PostEditor";
import PostPreview from "./PostPreview";

export default function FacebookComposer() {
  const [postContent, setPostContent] = useState("");
  const [images, setImages] = useState<File[]>([]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PostEditor
        postContent={postContent}
        setPostContent={setPostContent}
        images={images}
        setImages={setImages}
      />
      <PostPreview postContent={postContent} images={images} />
    </div>
  );
}
