package mju.paygo.member.infrastructure.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.NoArgsConstructor;
import mju.paygo.member.domain.auth.TokenProvider;
import mju.paygo.member.exception.exceptions.auth.ExpiredTokenException;
import mju.paygo.member.exception.exceptions.auth.SignatureInvalidException;
import mju.paygo.member.exception.exceptions.auth.TokenFormInvalidException;
import mju.paygo.member.exception.exceptions.auth.TokenInvalidException;
import mju.paygo.member.exception.exceptions.auth.UnsupportedTokenException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@NoArgsConstructor
@Component
public class JwtTokenProvider implements TokenProvider {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration-period}")
    private int expirationPeriod;

    private Key key;

    @PostConstruct
    private void init() {
        key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    @Override
    public String createTokenWith(final String email) {
        Claims claims = Jwts.claims();
        claims.put("email", email);
        return createToken(claims);
    }

    private String createToken(final Claims claims) {
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(issuedAt())
                .setExpiration(expiredAt())
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    private Date issuedAt() {
        LocalDateTime now = LocalDateTime.now();

        return Date.from(now.atZone(ZoneId.systemDefault())
                .toInstant());
    }

    private Date expiredAt() {
        LocalDateTime now = LocalDateTime.now();

        return Date.from(now.plusHours(expirationPeriod)
                .atZone(ZoneId.systemDefault())
                .toInstant());
    }

    @Override
    public String extract(final String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(secret.getBytes())
                    .parseClaimsJws(token)
                    .getBody()
                    .get("email", String.class);
        } catch (SecurityException e) {
            throw new SignatureInvalidException();
        } catch (MalformedJwtException e) {
            throw new TokenFormInvalidException();
        } catch (ExpiredJwtException e) {
            throw new ExpiredTokenException();
        } catch (UnsupportedJwtException e) {
            throw new UnsupportedTokenException();
        } catch (IllegalArgumentException e) {
            throw new TokenInvalidException();
        }
    }
}
