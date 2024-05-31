package mju.paygo.board.application;

import lombok.RequiredArgsConstructor;
import mju.paygo.board.application.event.BoardCreatedEvent;
import mju.paygo.board.domain.Board;
import mju.paygo.board.domain.BoardRepository;
import mju.paygo.board.exception.exceptions.BoardNotFoundException;
import mju.paygo.board.exception.exceptions.InvalidMemberException;
import mju.paygo.board.exception.exceptions.InvalidMemberIdException;
import mju.paygo.board.exception.exceptions.MealNotFoundException;
import mju.paygo.board.ui.dto.BoardFindResponse;
import mju.paygo.comment.domain.CommentRepository;
import mju.paygo.follow.domain.Follow;
import mju.paygo.follow.domain.FollowRepository;
import mju.paygo.likes.application.LikesService;
import mju.paygo.meal.domain.Meal;
import mju.paygo.meal.domain.MealRepository;
import mju.paygo.meal.domain.S3Uploader;
import mju.paygo.member.domain.member.Member;
import mju.paygo.member.domain.member.MemberRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Transactional
@Service
public class BoardService {

    private final BoardRepository boardRepository;
    private final LikesService likesService;
    private final CommentRepository commentRepository;
    private final MealRepository mealRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final FollowRepository followRepository;
    private final MemberRepository memberRepository;
    private final S3Uploader s3Uploader;

    public Board saveBoard(Member member, List<String> imageUrls, String content) {
        Board board = new Board(member, null, imageUrls, content, false);
        return boardRepository.save(board);
    }

    public Board saveBoardWithMeal(Member member, Long mealId, String content, List<String> imageUrls) {
        Meal meal = mealRepository.findById(mealId)
                .orElseThrow(MealNotFoundException::new);

        Board board = new Board(member, meal, imageUrls, content, false);
        boardRepository.save(board);

        eventPublisher.publishEvent(new BoardCreatedEvent(mealId));
        return board;
    }
/*
    public List<BoardFindResponse> findByMemberId(final Long memberId) {
        return boardRepository.findByMemberId(memberId).stream()
                .map(board -> toBoardFindResponse(board, memberId))
                .collect(Collectors.toList());
    }
*/
    public void updateBoard(final Long boardId, final Long memberId, final String content, final List<MultipartFile> imageFiles) {
        Board board = boardRepository.findByIdAndMemberId(boardId, memberId)
                .orElseThrow(BoardNotFoundException::new);

        if (!board.getMember().getId().equals(memberId)) {
            throw new InvalidMemberException();
        }
        board.updateContent(content);

        // 이미지 파일이 전달된 경우에만 업데이트 수행
        if (imageFiles != null && !imageFiles.isEmpty()) {
            List<String> imageUrls = new ArrayList<>();
            for (MultipartFile file : imageFiles) {
                String fileUrl = s3Uploader.outerUpload(file, memberId);
                imageUrls.add(fileUrl);
            }
            board.setImageUrls(imageUrls);
        }
    }

    public void updateBoardVerifiedStatusByMealId(Long mealId, Boolean verified) {
        Board board = boardRepository.findByMealId(mealId)
                .orElseThrow(BoardNotFoundException::new);
        board.setVerified(verified);
        boardRepository.save(board);
    }

    public void deleteBoard(final Long memberId, final Long boardId) {
        Board board = boardRepository.findByIdAndMemberId(boardId, memberId)
                .orElseThrow(BoardNotFoundException::new);
        boardRepository.delete(board);
    }

    public List<BoardFindResponse> findAllByMemberId(final Long memberId) {
        return boardRepository.findByMemberId(memberId).stream()
                .map(board -> toBoardFindResponse(board, memberId))
                .collect(Collectors.toList());
    }

    public List<BoardFindResponse> findAllExceptMemberId(final Long memberId) {
        return boardRepository.findAll().stream()
                .filter(board -> !board.getMember().getId().equals(memberId))
                .map(board -> toBoardFindResponse(board, memberId))
                .collect(Collectors.toList());
    }

    public List<BoardFindResponse> findAllByFollowing(final Long memberId) {
        Member follower = memberRepository.findById(memberId)
                .orElseThrow(InvalidMemberIdException::new);

        List<Follow> followings = followRepository.findAllByFollower(follower);
        List<Member> followingMembers = followings.stream()
                .map(Follow::getFollowee)
                .collect(Collectors.toList());

        return boardRepository.findBoardsByFollowedUsers(followingMembers).stream()
                .map(board -> toBoardFindResponse(board, memberId))
                .collect(Collectors.toList());
    }

    public Optional<Board> findById(final Long boardId) {
        return boardRepository.findById(boardId);
    }

    public List<BoardFindResponse> findAllByFollowing(final String nickname) {
        // MemberRepository를 통해 사용자를 nickname으로 찾습니다.
        Optional<Member> followerOpt = memberRepository.findByNickname(nickname);

        if (!followerOpt.isPresent()) {
            return Collections.emptyList();
        }

        Member follower = followerOpt.get();

        List<Follow> followings = followRepository.findAllByFollower(follower);
        List<Member> followingMembers = followings.stream()
                .map(Follow::getFollowee)
                .collect(Collectors.toList());

        return boardRepository.findBoardsByFollowedUsers(followingMembers).stream()
                .map(board -> toBoardFindResponse(board, board.getMember().getId()))
                .collect(Collectors.toList());
    }
    public Board save(final Board board) {
        return boardRepository.save(board);
    }

    private BoardFindResponse toBoardFindResponse(final Board board, final Long memberId) {
        Optional<Meal> meal = mealRepository.findByImageUrl(board.getImageUrls().get(0));

        BigDecimal kcal = meal.map(m -> new BigDecimal(String.valueOf(m.getNutrient().getKcal())))
                .orElse(BigDecimal.ZERO);

        return new BoardFindResponse(
                board.getId(),
                board.getContent(),
                board.getImageUrls(),
                board.getMember().getId(),
                board.getMember().getNickname(),
                likesService.countLikes(board.getId()),
                likesService.hasLiked(memberId, board.getId()),
                commentRepository.countByBoard(board),
                kcal
        );
    }
}
