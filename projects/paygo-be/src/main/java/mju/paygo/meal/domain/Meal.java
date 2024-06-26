package mju.paygo.meal.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import mju.paygo.global.domain.BaseEntity;
import mju.paygo.meal.domain.vo.Nutrient;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class Meal extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long memberId;

    @Embedded
    @Column(nullable = false)
    private Nutrient nutrient;

    @Column(nullable = false)
    private String mealName;

    @Column(nullable = false)
    private String imageUrl;

    @Column(nullable = false)
    private Boolean exercised = false;

    @Column(nullable = false)
    private Boolean planed = false;

    @Column(nullable = false)
    private Boolean posted = false;

    private Meal(final Long memberId, final Nutrient nutrient, final String mealName, final String imageUrl) {
        this.memberId = memberId;
        this.nutrient = nutrient;
        this.mealName = mealName;
        this.imageUrl = imageUrl;
    }

    public static Meal of(final Long memberId, final Nutrient nutrient, final String mealName, final String imageUrl) {
        return new Meal(memberId, nutrient, mealName, imageUrl);
    }

    public void clearExercise() {
        this.exercised = true;
    }

    public void updatePlaned() {
        this.planed = true;
    }

    public void clearUpload() {
        this.posted = true;
    }
}
