import React, { useState } from "react";
import Header from "components/Header";
import { GetStaticProps } from "next";
import PortableText from "react-portable-text";
import { Post } from "typings";
import { urlFor, sanityClient } from "../../../sanity";
import blogStyles from "../../styles/blog.module.css";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";

interface formInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

interface Props {
  post: Post;
}

export default function BlogPost({ post }: Props) {
  const [submitted, setSubmitted] = useState(false);

  console.log(post);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const formData: formInput = data as formInput;
    await fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(formData),
    })
      .then(() => {
        console.log(formData);
        setSubmitted(true);
      })
      .catch((err) => {
        console.log(err);
        setSubmitted(false);
      });
  };

  return (
    <main>
      <Header />

      <img
        className={blogStyles.blog_main__image}
        src={urlFor(post.mainImage).url()!}
        alt="Main image for blog"
      />

      <article className={blogStyles.article__width}>
        <h1 className={blogStyles.blog__title}>{post.title}</h1>
        <h2 className={blogStyles.blog__description}>{post.description}</h2>

        <div className={blogStyles.blog__top_styles}>
          <img
            className={blogStyles.author__image}
            src={urlFor(post.author.image).url()}
            alt=""
          />
          <p className={blogStyles.post__info}>
            Blog post by <span className="green-text">{post.author.name}</span>{" "}
            - published at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>

        <div>
          <PortableText
            className=""
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1
                  className="twenty-two-size-font font-bold mtopbot-20"
                  {...props}
                />
              ),
              h2: (props: any) => (
                <h2
                  className="twenty-size-font font-bold mtopbot-20"
                  {...props}
                />
              ),
              li: ({ children }: any) => (
                <li className="mleft-16 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="blue-text under-hover"></a>
              ),
            }}
          />
        </div>
      </article>

      <hr className={blogStyles.blog_end_line} />

      {submitted ? (
        <div className={blogStyles.on_submit_styling}>
          <h3>Thank you for submitting your comment!</h3>
          <p>Once it has been approved, it will appear below!</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={blogStyles.blog__form}
        >
          <h3>Enjoyed this Article?</h3>
          <h4>Leave a Comment below!</h4>
          <hr />

          <input
            {...register("_id")}
            type="hidden"
            name="_id"
            value={post._id}
          />

          <label className="bottom-margin-20 display-block">
            <span className="color-grey">Name</span>
            <input
              {...register("name", { required: true })}
              className="box-shadow rounded-border form-input display-block w-full"
              placeholder="John Appleseed"
              type="text"
            />
          </label>
          <label className="bottom-margin-20 display-block">
            <span className="color-grey">Email</span>
            <input
              {...register("email", { required: true })}
              className="box-shadow rounded-border form-input display-block w-full"
              placeholder="John.Appleseed@email.com"
              type="email"
            />
          </label>
          <label className="bottom-margin-20 display-block">
            <span className="color-grey">Comment</span>
            <textarea
              {...register("comment", { required: true })}
              className="box-shadow rounded-border form-input display-block w-full"
              placeholder="Comment about whatever!"
              rows={8}
            />
          </label>
          <div className="flex-col">
            {errors.name && (
              <span className="red-text">- The Name Field is required</span>
            )}
            {errors.email && (
              <span className="red-text">- The Email Field is required</span>
            )}
            {errors.comment && (
              <span className="red-text">- The Comment Field is required</span>
            )}
          </div>
          <input type="submit" className={blogStyles.button} />
        </form>
      )}

      {/* Comments */}
      <div className="flex-col padding-40 mtopbot-40 max-width-672 m-0-auto yellow-shadow">
        <h3 className="thirty-six-font">Comments</h3>
        <hr className={blogStyles.comment__padding} />

        {post.comments.map((comment) => (
          <div key={comment._id}>
            <p>
              <span className="yellow-text">{comment.name}: </span>
              {comment.comment}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

export async function getStaticPaths() {
  const query = `*[_type == 'post'] {
          _id,
          slug {
            current
          }
       }`;

  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == 'post' && slug.current == "my-first-test-post"][0] {
        _id,
        _createdAt,
        title,
        author -> {
          name,
          image
        },
        'comments': *[
            _type == 'comment' && 
            post._ref == ^._id &&
            approved == true],
        description,
        mainImage,
        slug,
        body
   }`;

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 60, // after 60 seconds it will update the old cache
  };
};
