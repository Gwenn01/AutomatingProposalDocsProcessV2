import ReviewerComment from "./ReviewerComment";

const ReviewList = ({ reviews }) => (
  reviews?.length
    ? reviews.map((r, i) => (
        <ReviewerComment
          key={r.review_id || i}
          title={`Reviewer's Comment ${i + 1}`}
          comment={r.comment}
          reviewerName={r.reviewer_name}
        />
      ))
    : <ReviewerComment comment="" reviewerName="" />
);

export default ReviewList;