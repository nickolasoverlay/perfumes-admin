import useSWR from "swr";
import fetcher from "./fetcher";

import { Post } from "./../pages/Blog/types";

const usePost = (id: string) => {
    const { data, mutate, error } = useSWR<Post>(
        `${process.env.REACT_APP_API}/admin/posts/${id}/`,
        fetcher
    );

    return {
        post: data as Post,
        isLoading: !error && !data,
        isError: error,

        updatePost: async (product: Post) => {
            await fetch(`${process.env.REACT_APP_API}/admin/posts/update/`, {
                method: "POST",
                body: JSON.stringify(product),
                credentials: "include",
            });

            mutate({ ...data, ...product });
        },

        updatePostWallpaper: (wallpaper: string) => {
            const post: Post = data as Post;
            post.wallpaper = wallpaper;

            mutate({ ...data, ...post });
        },
    };
};

export default usePost;
