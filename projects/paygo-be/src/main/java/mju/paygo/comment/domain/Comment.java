package mju.paygo.comment.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import mju.paygo.board.domain.Board;
import mju.paygo.global.domain.BaseEntity;
import mju.paygo.member.domain.member.Member;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class Comment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id", nullable = false)
    private Board board;

    @Lob
    @Column(nullable = false)
    private String content;

    private Comment(final Member member, final Board board, final String content) {
        this.member = member;
        this.board = board;
        this.content = content;
    }

    public static Comment of(final Member member, final Board board, final String content) {
        return new Comment(member, board, content);
    }

    public void updateContent(final String content) {
        this.content = content;
    }
}
