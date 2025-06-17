package com.arianewelke.checkFit.infra.security;

import com.arianewelke.checkFit.entity.User;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService  {
//lógica de geração e validação dos tokens
    @Value("${api.security.token.secret}") //vem la do properties
    private String secret;


    public String generateToken(User user) {
        try{
            Algorithm algorithm = Algorithm.HMAC256(secret);
            //geração do token
            String token = JWT.create()
                    .withIssuer("login-auth-api")
                    .withSubject(user.getEmail())
                    .withExpiresAt(this.generateExpirationDate())
                    .sign(algorithm);
            return token;
        } catch (JWTCreationException exception){
            throw new RuntimeException("Error while authenticating");
        }
    }

    //validação do token
    public String validateToken(String token) {
        try{
            Algorithm algorithm = Algorithm.HMAC256(secret);
            DecodedJWT decodedJWT = (DecodedJWT) JWT.require(algorithm)
                    .withIssuer("login-auth-api")
                    .build()
                    .verify(token);

            return decodedJWT.getSubject();

        } catch (JWTVerificationException exception){
            return null;
        }
    }

    private Instant generateExpirationDate() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of(String.valueOf(-3)));

    }

}
