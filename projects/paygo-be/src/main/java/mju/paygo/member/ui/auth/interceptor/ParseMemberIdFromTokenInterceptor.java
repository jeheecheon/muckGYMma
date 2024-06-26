package mju.paygo.member.ui.auth.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import mju.paygo.member.ui.auth.support.auth.AuthenticationContext;
import mju.paygo.member.ui.auth.support.auth.AuthenticationExtractor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@RequiredArgsConstructor
@Component
public class ParseMemberIdFromTokenInterceptor implements HandlerInterceptor {

    private final LoginValidCheckerInterceptor loginValidCheckerInterceptor;
    private final AuthenticationContext authenticationContext;

    @Override
    public boolean preHandle(final HttpServletRequest request,
                             final HttpServletResponse response,
                             final Object handler) throws Exception {
        if (AuthenticationExtractor.extract(request).isEmpty()) {
            authenticationContext.setAnonymous();
            return true;
        }

        return loginValidCheckerInterceptor.preHandle(request, response, handler);
    }
}
