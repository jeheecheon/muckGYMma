package mju.paygo.physicalprofile.application;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import mju.paygo.physicalprofile.domain.PhysicalProfile;
import mju.paygo.physicalprofile.domain.PhysicalProfileRepository;
import mju.paygo.physicalprofile.domain.dto.PhysicalProfileCreateRequest;
import mju.paygo.physicalprofile.domain.dto.PhysicalProfileEditRequest;
import mju.paygo.physicalprofile.exception.exceptions.PhysicalProfileNotFoundException;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Transactional
@Service
public class PhysicalProfileService {

    private final PhysicalProfileRepository physicalProfileRepository;

    public void writePhysicalProfile(final Long memberId, final PhysicalProfileCreateRequest request) {
        PhysicalProfile physicalProfile = PhysicalProfile.from(memberId, request);
        if (!physicalProfileRepository.isExistByMemberId(memberId)) {
            physicalProfileRepository.save(physicalProfile);
        }
    }

    public void editPhysicalProfile(final Long memberId, final PhysicalProfileEditRequest request) {
        PhysicalProfile physicalProfile = physicalProfileRepository.findByMemberId(memberId)
                .orElseThrow(PhysicalProfileNotFoundException::new);
        physicalProfile.edit(request);
    }
}
