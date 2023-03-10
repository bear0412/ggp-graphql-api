import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLBoolean as BooleanType,
  GraphQLInt as IntType,
  GraphQLFloat as FloatType,
  GraphQLNonNull as NonNull,
  GraphQLList as List,
} from 'graphql';
import moment from 'moment';

import UserVerifiedInfoType from './UserVerifiedInfoType';
import CancellationType from './CancellationType';
import ListCalendarType from './ListCalendarType';
import UserBedTypes from './UserBedTypes';
import ReviewsType from './ReviewsType';

import PopularLocationType from './siteadmin/PopularLocationType'
import { Cancellation, Reviews, ListCalendar, WishList, Listing, BedTypes, ListSettings, ListPhotos, PopularLocation } from '../models';
import { ListBlockedDates as BlockedDates } from '../models';
import sequelize from '../sequelize';

const Profile = new ObjectType({
  name: 'profile',
  fields: {
    profileId: {
      type: IntType,
    },
    firstName: {
      type: StringType,
    },
    lastName: {
      type: StringType,
    },
    displayName: {
      type: StringType,
    },
    dateOfBirth: {
      type: StringType,
    },
    picture: {
      type: StringType,
    },
    location: {
      type: StringType,
    },
    info: {
      type: StringType,
    },
    createdAt: {
      type: StringType,
    }
  }
});
const User = new ObjectType({
  name: 'user',
  fields: {
    email: {
      type: StringType,
      resolve(user) {
        return user.email;
      }
    },
    profile: {
      type: Profile,
      resolve(user) {
        return user.getProfile();
      }
    },
    verification: {
      type: UserVerifiedInfoType,
      resolve(user) {
        return user.getUserVerifiedInfo();
      }
    },
    userBanStatus: {
      type: IntType,
      resolve(user) {
        return user.userBanStatus;
      }
    },
  }
});
const ListSettingsTypes = new ObjectType({
  name: 'listSettingsTypes',
  fields: {
    id: { type: IntType },
    typeName: { type: StringType },
    typeLabel: { type: StringType },
    step: { type: StringType },
    fieldType: { type: StringType },
    isEnable: { type: StringType },
    status: { type: StringType },
  },
});
const SingleListSettings = new ObjectType({
  name: 'singleListSettings',
  fields: {
    id: { type: IntType },
    typeId: { type: IntType },
    itemName: { type: StringType },
    otherItemName: { type: StringType },
    maximum: { type: IntType },
    minimum: { type: IntType },
    startValue: { type: IntType },
    endValue: { type: IntType },
    isEnable: { type: StringType },
    image: { type: StringType },
    settingsType: {
      type: ListSettingsTypes,
      resolve(singleListSettings) {
        return singleListSettings.getListSettingsTypes();
      }
    },
  }
});

const AllListSettingTypes = new ObjectType({
  name: 'allListSettingTypes',
  fields: {
    id: {
      type: IntType,
    },
    itemName: {
      type: StringType
    },
    image: {
      type: StringType
    }
  }
});

// Spaces
const ListBedTypes = new ObjectType({
  name: 'listBedTypes',
  fields: {
    bedType: {
      type: IntType,
      resolve(listBedTypes) {
        return listBedTypes.bedType;
      }
    },
    listsettings: {
      type: SingleListSettings,
      resolve(listBedTypes) {
        return listBedTypes.getListSettings();
      }
    },
  }
});

// List Blocked Dates
const ListBlockedDates = new ObjectType({
  name: 'listBlockedDates',
  fields: {
    blockedDates: {
      type: StringType,
      async resolve(listBlockedDates) {
        return listBlockedDates && listBlockedDates.blockedDates ? moment.utc(`${listBlockedDates.blockedDates} 12:00`).valueOf() : "";
      }
    },
    reservationId: {
      type: IntType,
      resolve(listBlockedDates) {
        return listBlockedDates.reservationId;
      }
    },
    listId: {
      type: IntType,
      resolve(listBlockedDates) {
        return listBlockedDates.listId;
      }
    },
    calendarStatus: { type: StringType },
    isSpecialPrice: { type: FloatType },
    dayStatus: { type: StringType },
  }
});
// Listing More Data
const ListingData = new ObjectType({
  name: 'listingData',
  fields: {
    bookingNoticeTime: { type: StringType },
    checkInStart: { type: StringType },
    checkInEnd: { type: StringType },
    maxDaysNotice: { type: StringType },
    minNight: { type: IntType },
    maxNight: { type: IntType },
    basePrice: { type: FloatType },
    cleaningPrice: { type: FloatType },
    currency: { type: StringType },
    weeklyDiscount: { type: IntType },
    monthlyDiscount: { type: IntType },
    cancellationPolicy: { type: IntType },
    cancellation: {
      type: CancellationType,
      resolve(listingData) {
        return Cancellation.findOne({
          where: {
            id: listingData.cancellationPolicy,
            isEnable: true
          }
        });
      }
    }
  }
});
// User Listing Data
const UserListingData = new ObjectType({
  name: 'userListingData',
  fields: {
    id: {
      type: IntType,
      resolve(userListingData) {
        return userListingData.id;
      }
    },
    settingsId: {
      type: IntType,
      resolve(userListingData) {
        return userListingData.settingsId;
      }
    },
    listsettings: {
      type: SingleListSettings,
      async resolve(userListingData) {
        return await ListSettings.findOne({
          where: {
            id: userListingData.settingsId,
            isEnable: '1'
          }
        });
      }
    },
  }
});
// Listing Steps
const UserListingSteps = new ObjectType({
  name: 'userListingSteps',
  fields: {
    id: { type: IntType },
    listId: { type: IntType },
    step1: { type: StringType },
    step2: { type: StringType },
    step3: { type: StringType },
    currentStep: { type: IntType },
    status: { type: StringType },
  },
});
// Recommended Listing
const Recommend = new ObjectType({
  name: 'recommend',
  fields: {
    id: { type: IntType },
    listId: { type: IntType },
    status: { type: StringType },
  },
});
// Listing Photos
const ListPhotosData = new ObjectType({
  name: 'listPhotosData',
  fields: {
    id: { type: IntType },
    listId: { type: IntType },
    name: { type: StringType },
    type: { type: StringType },
    status: { type: StringType },
  },
});

const ShowListingType = new ObjectType({
  name: 'ShowListing',
  fields: {
    id: { type: IntType },
    userId: { type: StringType },
    title: { type: StringType },
    description: { type: StringType },
    bedrooms: { type: StringType },
    residenceType: { type: StringType },
    buildingSize: { type: StringType },
    beds: { type: IntType },
    personCapacity: { type: IntType },
    bathrooms: { type: FloatType },
    country: { type: StringType },
    street: { type: StringType },
    buildingName: { type: StringType },
    city: { type: StringType },
    state: { type: StringType },
    zipcode: { type: StringType },
    lat: { type: FloatType },
    lng: { type: FloatType },
    coverPhoto: {
      type: IntType,
      async resolve(listing) {
        let cover, coverImageData;
        if (listing && listing.coverPhoto) {
          let coverImage = await ListPhotos.findOne({
            where: {
              id: listing.coverPhoto
            }
          })
          if (coverImage) {
            cover = coverImage.id;
          } else {
            cover = null;
          }
        } else if (listing) {
          coverImageData = await ListPhotos.findOne({
            where: {
              listId: listing.id
            },
            order: [[`id`, `ASC`]],
            limit: 1,
          })
          if (coverImageData) {
            cover = coverImageData.id;
          } else {
            cover = null;
          }
        }
        return await cover;
      }
    },
    listCoverPhoto: {
      type: ListPhotosData,
      resolve(listing) {
        if (listing.coverPhoto) {
          return ListPhotos.findOne({
            where: {
              id: listing.coverPhoto
            }
          })
        } else {
          return ListPhotos.findOne({
            where: {
              listId: listing.id
            },
            order: [[`id`, `ASC`]],
            limit: 1,
          })
        }
      }
    },
    listPhotos: {
      type: new List(ListPhotosData),
      resolve(listing) {
        return listing.getListPhotos()
      }
    },
    listPhotoName: {
      type: StringType,
      async resolve(listing) {
        let fileName = null, findCoverPhoto;
        const allPhotos = await listing.getListPhotos();

        if (allPhotos && allPhotos.length > 0) {
          if (listing.coverPhoto) {
            findCoverPhoto = allPhotos.find(o => o.id === listing.coverPhoto);
            if (findCoverPhoto) {
              fileName = findCoverPhoto.name;
            } else {
              fileName = allPhotos[0].name;
            }
          } else {
            fileName = allPhotos[0].name;
          }
        }
        return await fileName;
      }
    },
    listingPhotos: {
      type: new List(ListPhotosData),
      async resolve(listing) {
        const allPhotos = await listing.getListPhotos();
        if (allPhotos && allPhotos.length > 0) {
          let findCoverPhoto, newArray = [];
          findCoverPhoto = allPhotos.find(o => o.id === listing.coverPhoto);
          if (findCoverPhoto) {
            let newArray = allPhotos.slice(0);
            let unSelectIndex = newArray.findIndex(o => (o.id == listing.coverPhoto));

            if (unSelectIndex >= 0) {
              newArray.splice(unSelectIndex, 1);
            }

            newArray.splice(0, 0, findCoverPhoto);

            return newArray;
          } else {
            return allPhotos;
          }
        }
      }
    },
    isMapTouched: { type: BooleanType },
    bookingType: { type: StringType },
    isPublished: { type: BooleanType },
    isReady: { type: BooleanType },
    listApprovalStatus: { type: StringType },
    status: { type: StringType },
    updatedAt: { type: StringType },
    lastUpdatedAt: { type: StringType },
    createdAt: { type: StringType },
    count: { type: IntType },
    user: {
      type: User,
      resolve(listing) {
        return listing.getUser();
      }
    },
    settingsData: {
      type: new List(UserListingData),
      resolve(listing) {
        return listing.getUserListingData();
      }
    },
    roomType: {
      type: StringType,
      async resolve(listing) {
        let roomTypeLabel = null;
        const roomTypeData = await sequelize.query(`SELECT itemName from ListSettings WHERE id IN(SELECT settingsId from UserListingData WHERE listId=${listing.id}) AND typeId=1 LIMIT 1;`, {
          type: sequelize.QueryTypes.SELECT
        });
        if (roomTypeData && roomTypeData.length > 0) {
          roomTypeLabel = roomTypeData[0]['itemName'] ? roomTypeData[0]['itemName'] : null;
        }
        return await roomTypeLabel;
      }
    },
    listBedTypes: {
      type: new List(ListBedTypes),
      resolve(listing) {
        return listing.getBedTypes();
      }
    },
    listingData: {
      type: ListingData,
      resolve(listing) {
        return listing.getListingData();
      }
    },
    blockedDates: {
      type: new List(ListBlockedDates),
      async resolve(listing) {
        let convertStartDate = new Date();
        convertStartDate.setHours(0, 0, 0, 0);
        return await BlockedDates.findAll({
          where: {
            listId: listing.id,
            blockedDates: {
              $gte: convertStartDate
            },
          },
          order: [
            [`blockedDates`, `ASC`],
          ],
        })
      }
    },
    checkInBlockedDates: {
      type: new List(ListBlockedDates),
      async resolve(listing) {
        let convertStartDate = new Date();
        convertStartDate.setHours(0, 0, 0, 0);
        return await BlockedDates.findAll({
          where: {
            dayStatus: 'secondHalf',
            listId: listing.id,
            blockedDates: {
              $gte: convertStartDate
            },
            calendarStatus: 'blocked',
          },
          order: [
            [`blockedDates`, `ASC`],
          ],
        })
      }
    },
    fullBlockedDates: {
      type: new List(ListBlockedDates),
      async resolve(listing) {
        let convertStartDate = new Date();
        convertStartDate.setHours(0, 0, 0, 0);
        return await BlockedDates.findAll({
          where: {
            dayStatus: 'full',
            listId: listing.id,
            blockedDates: {
              $gte: convertStartDate
            },
            calendarStatus: 'blocked',
          },
          order: [
            [`blockedDates`, `ASC`],
          ],
        })
      }
    },
    listingSteps: {
      type: UserListingSteps,
      resolve(listing) {
        return listing.getUserListingSteps();
      }
    },
    recommend: {
      type: Recommend,
      resolve(listing) {
        return listing.getRecommend();
      }
    },
    reviewsCount: {
      type: IntType,
      async resolve(listing) {
        return await Reviews.count({
          where: {
            listId: listing.id,
            userId: listing.userId
          }
        });
      }
    },
    reviewsStarRating: {
      type: IntType,
      async resolve(listing) {
        const reviewsSum = await Reviews.sum('rating', {
          where: {
            listId: listing.id,
            userId: listing.userId
          }
        });

        return parseInt(reviewsSum) || 0;
      }
    },
    reviews: {
      type: new List(ReviewsType),
      async resolve(listing) {
        return await Reviews.findAll({
          where: {
            listId: listing.id,
            userId: listing.userId
          },
          order: [['createdAt', 'DESC']],
          limit: 1
        });
      }
    },
    calendars: {
      type: new List(ListCalendarType),
      async resolve(listing) {
        return await ListCalendar.findAll({
          where: {
            listId: listing.id,
          },
        });
      }
    },
    wishListStatus: {
      type: BooleanType,
      async resolve(listing, { }, request) {
        let userId = (request && request.user) ? request.user.id : '';
        let count = await WishList.count({
          where: {
            listId: listing.id,
            userId
          },
        });
        return (count) ? true : false
      }
    },
    wishListGroupCount: {
      type: IntType,
      async resolve(listing, { }, request) {
        let userId = (request && request.user) ? request.user.id : '';
        let count = await WishList.count({
          where: {
            listId: listing.id,
            userId
          },
        });
        return count;
      }
    },
    isListOwner: {
      type: BooleanType,
      async resolve(listing, { }, request) {
        let userId = (request && request.user) ? request.user.id : '';
        let count = await Listing.count({
          where: {
            id: listing.id,
            userId
          },
        });
        return (count) ? true : false;
      }
    },
    userBedsTypes: {
      type: new List(UserBedTypes),
      async resolve(bedtypes) {
        const bedTypeData = await BedTypes.findAll({
          where: {
            listId: bedtypes.id,
          },
        });
        let result;
        let finalArray = [];
        if (bedTypeData && bedTypeData.length > 0) {
          result = bedTypeData.reduce((acc, o) => (acc[o.bedType] = (acc[o.bedType] || 0) + 1, acc), {});
        }
        if (result) {
          finalArray = Object.keys(result).map(async function (key) {
            if (key != 'null') {
              const bedName = await ListSettings.findOne({
                attributes: ['itemName'],
                where: {
                  id: key,
                },
              });
              return { 'bedCount': Number(result[key]), 'bedType': key, "listId": bedtypes.id, "bedName": bedName && bedName.itemName };
            }
          });
        }
        return finalArray;
      }
    },
    userAmenities: {
      type: new List(AllListSettingTypes),
      async resolve(listing) {
        let amenityArray = [];
        const amenitiesData = await sequelize.query(`SELECT * from ListSettings WHERE id IN(SELECT amenitiesId from UserAmenities WHERE listId=${listing.id}) AND typeId=10;`, {
          type: sequelize.QueryTypes.SELECT
        });

        if (amenitiesData && amenitiesData.length > 0) {
          await Promise.all(amenitiesData.map((item, key) => {
            let amenityObject = {};
            amenityObject['id'] = item.id;
            amenityObject['itemName'] = item.itemName;
            amenityObject['image'] = item.image;
            amenityArray.push(amenityObject);
          })
          )
        }
        return amenityArray;
      }
    },
    userSafetyAmenities: {
      type: new List(AllListSettingTypes),
      async resolve(listing) {
        let safetyArray = [];
        const safetiesData = await sequelize.query(`SELECT * from ListSettings WHERE id IN(SELECT safetyAmenitiesId from UserSafetyAmenities WHERE listId=${listing.id}) AND typeId=11;`, {
          type: sequelize.QueryTypes.SELECT
        });

        if (safetiesData && safetiesData.length > 0) {
          await Promise.all(safetiesData.map((item, key) => {
            let safetyObject = {};
            safetyObject['id'] = item.id;
            safetyObject['itemName'] = item.itemName;
            safetyObject['image'] = item.image;
            safetyArray.push(safetyObject);
          })
          )
        }
        return safetyArray;
      }
    },
    userSpaces: {
      type: new List(AllListSettingTypes),
      async resolve(listing) {
        let spacesArray = [];
        const spacesData = await sequelize.query(`SELECT * from ListSettings WHERE id IN(SELECT spacesId from UserSpaces WHERE listId=${listing.id}) AND typeId=12;`, {
          type: sequelize.QueryTypes.SELECT
        });

        if (spacesData && spacesData.length > 0) {
          await Promise.all(spacesData.map((item, key) => {
            let spaceObject = {};
            spaceObject['id'] = item.id;
            spaceObject['itemName'] = item.itemName;
            spaceObject['image'] = item.image;
            spacesArray.push(spaceObject);
          })
          )
        }
        return spacesArray;
      }
    },
    houseRules: {
      type: new List(AllListSettingTypes),
      async resolve(listing) {
        let houseRulesArray = [];
        const houseRulesData = await sequelize.query(`SELECT * from ListSettings WHERE id IN(SELECT houseRulesId from UserHouseRules WHERE listId=${listing.id}) AND typeId=14;`, {
          type: sequelize.QueryTypes.SELECT
        });

        if (houseRulesData && houseRulesData.length > 0) {
          await Promise.all(houseRulesData.map((item, key) => {
            let houseRuleObject = {};
            houseRuleObject['id'] = item.id;
            houseRuleObject['itemName'] = item.itemName;
            houseRuleObject['image'] = item.image;
            houseRulesArray.push(houseRuleObject);
          })
          )
        }
        return houseRulesArray;
      }
    },
    houseType: {
      type: StringType,
      async resolve(listing) {
        let houseTypeLabel = null;
        const houseTypeData = await sequelize.query(`SELECT itemName from ListSettings WHERE id IN(SELECT settingsId from UserListingData WHERE listId=${listing.id}) AND typeId=3 LIMIT 1;`, {
          type: sequelize.QueryTypes.SELECT
        });
        if (houseTypeData && houseTypeData.length > 0) {
          houseTypeLabel = houseTypeData[0]['itemName'] ? houseTypeData[0]['itemName'] : null;
        }
        return await houseTypeLabel;
      }
    },
    popularLocationListing: {
      type: new List(PopularLocationType),
      async resolve() {
        return await PopularLocation.findAll({
          where: {
            isEnable: true,
          },
          order: [[sequelize.literal('RAND()')]],
        });
      }
    }
  },
});
export default ShowListingType;
