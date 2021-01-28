import useSWR from "swr";
import fetcher from "./fetcher";

import { Post, AddPostDialogFormProps } from "./../pages/Blog/types";

const usePosts = () => {
    const { data, mutate, error } = useSWR<Post[]>(
        `${process.env.REACT_APP_API}/admin/posts/`,
        fetcher
    );

    return {
        posts: data as Post[],
        isLoading: !error && !data,
        isError: error,

        pushPost: async (post: AddPostDialogFormProps) => {
            const createdPost = await fetch(
                `${process.env.REACT_APP_API}/admin/posts/create/`,
                {
                    method: "POST",
                    body: JSON.stringify(post),
                    credentials: "include",
                }
            ).then((res) => res.json());

            mutate([...(data as Post[]), createdPost]);
        },

        deletePost: async (postId: number) => {
            await fetch(`${process.env.REACT_APP_API}/admin/posts/delete/`, {
                method: "POST",
                body: JSON.stringify({ id: postId }),
                credentials: "include",
            });

            mutate([
                ...(data as Post[]).filter((filter) => filter.id !== postId),
            ]);
        },
    };
};

export default usePosts;
