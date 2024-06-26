package mju.paygo.preferexercises.application;

import lombok.RequiredArgsConstructor;
import mju.paygo.preferexercises.domain.PreferExercises;
import mju.paygo.preferexercises.domain.PreferExercisesRepository;
import mju.paygo.preferexercises.exception.exceptions.PreferExerciseNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Transactional
@Service
public class PreferExerciseService {

    private final PreferExercisesRepository preferExercisesRepository;

    public void create(final Long memberId, final List<String> exercisesName) {
        if (!preferExercisesRepository.isExistByMemberId(memberId)) {
            preferExercisesRepository.save(PreferExercises.of(memberId, exercisesName));
        }
    }

    public void edit(final Long memberId, final List<String> exercisesName) {
        PreferExercises preferExercises = preferExercisesRepository.findByMemberId(memberId)
                .orElseThrow(PreferExerciseNotFoundException::new);
        preferExercises.edit(exercisesName);
    }
}
