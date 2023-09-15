import { gql } from "@apollo/client";

const UserPublicMinData_User = gql`
  fragment UserPublicMinData_User on User {
    id
    avatar
    avatar_thumbnail
    username
    name
    resume
    city
    country
    state
    Membership {
      endDate
      plan {
        name
      }
    }
  }
`;

export const fragments = {
  publication: {
    publication: gql`
      fragment PublicationFull_Publication on Post {
        id
        reaction
        type
        views
        contents {
          id
          type
          content
        }
        parent {
          id
          user {
            ...UserPublicMinData_User
          }
        }
        user {
          ...UserPublicMinData_User
        }
      }
      ${UserPublicMinData_User}
    `,
  },
  user: {
    userFull: gql`
      fragment UserFull_User on User {
        id
        username
        name
        email
        resume
        avatar
        UserRole {
          role {
            name
          }
        }
        UserPermission {
          permission {
            name
          }
        }
        avatar_thumbnail
        cover
        phone
        Language {
          id
          name
        }
        refer {
          refer {
            city
            country
            username
          }
        }
        Membership {
          plan {
            PlanCapabilities {
              capabilitie {
                description
                id
                name
                type
              }
              capabilitieId
              count
              id
              name
              planId
            }
            description
            id
            name
            price
            type
          }
          endDate
        }
        UserCapabilities {
          count
          capabilitieId
        }
        amounts {
          id
          amount
          currency {
            id
            name
            code
          }
        }
      }
    `,
    userPublic: gql`
      fragment UserPublic_User on User {
        id
        username
        name
        email
        resume
        avatar
        UserRole {
          role {
            name
          }
        }
        UserPermission {
          permission {
            name
          }
        }
        avatar_thumbnail
        cover
        phone
        Language {
          id
          name
        }
        refer {
          refer {
            city
            country
            username
          }
        }
        Membership {
          plan {
            PlanCapabilities {
              capabilitie {
                description
                id
                name
                type
              }
              capabilitieId
              count
              id
              name
              planId
            }
            description
            id
            name
            price
            type
          }
          endDate
        }
        UserCapabilities {
          count
          capabilitieId
        }
        amounts {
          id
          amount
          currency {
            id
            name
            code
          }
        }
      }
    `,
    userPublicMinData: UserPublicMinData_User,
    userMinData: gql`
      fragment UserMinData_User on User {
        following {
          following {
            id
          }
        }
        id
        username
        Membership {
          endDate
          plan {
            name
          }
        }
      }
    `,
  },
};
