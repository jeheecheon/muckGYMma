package mju.paygo.member.ui.member;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mju.paygo.member.application.member.MemberService;
import mju.paygo.member.application.member.dto.NicknameRequest;
import mju.paygo.member.domain.member.Member;
import mju.paygo.member.infrastructure.member.dto.MemberSettingResponse;
import mju.paygo.member.ui.auth.support.auth.AuthMember;
import mju.paygo.member.ui.member.dto.MemberEditRequest;
import mju.paygo.member.ui.member.dto.MemberInitializeRequest;
import mju.paygo.member.ui.member.dto.MemberInitializeResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RequestMapping("/api/member")
@RestController
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/setup")
    public ResponseEntity<Void> initialize(@AuthMember final Long memberId, @RequestBody @Valid final MemberInitializeRequest request) {
        memberService.writeInitializeSetting(memberId, request);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/setup")
    public ResponseEntity<Void> editSetting(@AuthMember final Long memberId, @RequestBody @Valid final MemberEditRequest request) {
        memberService.editSetting(memberId, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/setup")
    public ResponseEntity<MemberSettingResponse> viewSetting(@AuthMember final Long memberId) {
        MemberSettingResponse response = memberService.viewSetting(memberId);
        return ResponseEntity.ok()
                .body(response);
    }

    @GetMapping("/initialized")
    public ResponseEntity<MemberInitializeResponse> isInitialized(@AuthMember final Long memberId) {
        Member member = memberService.findById(memberId);
        return ResponseEntity.ok()
                .body(new MemberInitializeResponse(member.isInitialized()));
    }

    @PatchMapping("/nickname")
    public ResponseEntity<Void> changeNickname(@AuthMember final Long memberId, @RequestBody @Valid final NicknameRequest request) {
        memberService.editNickname(memberId, request.nickname());
        return ResponseEntity.ok().build();
    }
}
